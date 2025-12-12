"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PsicosocialService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsicosocialService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const registro_psicosocial_entity_1 = require("../entities/registro-psicosocial.entity");
const paciente_entity_1 = require("../entities/paciente.entity");
const generative_ai_1 = require("@google/generative-ai");
let PsicosocialService = PsicosocialService_1 = class PsicosocialService {
    constructor(repo, pacienteRepo, dataSource) {
        this.repo = repo;
        this.pacienteRepo = pacienteRepo;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(PsicosocialService_1.name);
        const apiKey = process.env.GOOGLE_GENAI_API_KEY;
        if (apiKey) {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        }
        else {
            this.logger.warn('GOOGLE_GENAI_API_KEY is not defined. AI features will be disabled.');
        }
    }
    async registrarEvaluacion(dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const paciente = await this.pacienteRepo.findOne({ where: { id_paciente: dto.idPaciente } });
            if (!paciente)
                throw new Error('Paciente no encontrado');
            const registro = this.repo.create({
                paciente: paciente,
                nivel_estres: dto.nivelEstres,
                sintomas_referidos: dto.sintomas,
                narrativa_paciente: dto.narrativa,
            });
            if (this.genAI) {
                try {
                    const analysis = await this.analyzeWithGemini(dto.narrativa, dto.sintomas);
                    registro.resumen_ia = analysis.summary;
                    registro.analisis_sentimiento_ia = analysis.sentiment;
                    registro.riesgo_suicida = analysis.risk;
                    registro.derivar_a_psicologia = analysis.referral;
                }
                catch (aiError) {
                    this.logger.error('Error with Gemini AI:', aiError);
                    registro.resumen_ia = 'Análisis de IA no disponible temporalmente.';
                }
            }
            await queryRunner.manager.save(registro);
            await queryRunner.commitTransaction();
            return registro;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(err);
            throw new common_1.InternalServerErrorException('Error al registrar evaluación psicosocial');
        }
        finally {
            await queryRunner.release();
        }
    }
    async analyzeWithGemini(narrativa, sintomas = []) {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `
        Actúa como un psicólogo clínico experto. Analiza la siguiente evaluación de un paciente:
        
        Síntomas reportados: ${sintomas.join(', ')}
        Narrativa del paciente: "${narrativa}"

        Genera un objeto JSON con los siguientes campos estrictos (sin markdown):
        {
            "summary": "Resumen conciso de 1 párrafo para el médico general, destacando puntos clave.",
            "sentiment": "Positivo" | "Neutro" | "Negativo",
            "risk": boolean (true si detectas riesgo de autolesión o suicidio, false si no),
            "referral": boolean (true si recomiendas derivar a especialista, false si es manejable)
        }
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        try {
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanedText);
        }
        catch (e) {
            this.logger.error('Failed to parse AI response', text);
            return {
                summary: 'Error al analizar la respuesta de IA.',
                sentiment: 'Neutro',
                risk: false,
                referral: false
            };
        }
    }
    async getPorPaciente(idPaciente) {
        return this.repo.find({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_registro: 'DESC' }
        });
    }
};
exports.PsicosocialService = PsicosocialService;
exports.PsicosocialService = PsicosocialService = PsicosocialService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(registro_psicosocial_entity_1.RegistroPsicosocial)),
    __param(1, (0, typeorm_1.InjectRepository)(paciente_entity_1.Paciente)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], PsicosocialService);
//# sourceMappingURL=psicosocial.service.js.map
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { RegistroPsicosocial } from '../entities/registro-psicosocial.entity';
import { Paciente } from '../entities/paciente.entity';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class PsicosocialService {
    private readonly logger = new Logger(PsicosocialService.name);
    private genAI: GoogleGenerativeAI;

    constructor(
        @InjectRepository(RegistroPsicosocial)
        private repo: Repository<RegistroPsicosocial>,
        @InjectRepository(Paciente)
        private pacienteRepo: Repository<Paciente>,
        private dataSource: DataSource,
    ) {
        const apiKey = process.env.GOOGLE_GENAI_API_KEY;
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
        } else {
            this.logger.warn('GOOGLE_GENAI_API_KEY is not defined. AI features will be disabled.');
        }
    }

    async registrarEvaluacion(dto: CreateEvaluacionDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const paciente = await this.pacienteRepo.findOne({ where: { id_paciente: dto.idPaciente } });
            if (!paciente) throw new Error('Paciente no encontrado');

            // 1. Save initial record
            const registro = this.repo.create({
                paciente: paciente,
                nivel_estres: dto.nivelEstres,
                sintomas_referidos: dto.sintomas, // Auto-cast to jsonb
                narrativa_paciente: dto.narrativa,
            });

            // 2. AI Analysis (Optional but recommended)
            if (this.genAI) {
                try {
                    const analysis = await this.analyzeWithGemini(dto.narrativa, dto.sintomas);
                    registro.resumen_ia = analysis.summary;
                    registro.analisis_sentimiento_ia = analysis.sentiment;
                    registro.riesgo_suicida = analysis.risk;
                    registro.derivar_a_psicologia = analysis.referral;
                } catch (aiError) {
                    this.logger.error('Error with Gemini AI:', aiError);
                    // Continue without AI data, don't block saving
                    registro.resumen_ia = 'Análisis de IA no disponible temporalmente.';
                }
            }

            await queryRunner.manager.save(registro);
            await queryRunner.commitTransaction();

            return registro;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(err);
            throw new InternalServerErrorException('Error al registrar evaluación psicosocial');
        } finally {
            await queryRunner.release();
        }
    }

    private async analyzeWithGemini(narrativa: string, sintomas: string[] = []) {
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

        // Sanitize and parse JSON
        try {
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanedText);
        } catch (e) {
            this.logger.error('Failed to parse AI response', text);
            return {
                summary: 'Error al analizar la respuesta de IA.',
                sentiment: 'Neutro',
                risk: false,
                referral: false
            };
        }
    }

    async getPorPaciente(idPaciente: number) {
        return this.repo.find({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_registro: 'DESC' }
        });
    }
}

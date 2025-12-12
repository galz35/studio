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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEvaluacionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateEvaluacionDto {
}
exports.CreateEvaluacionDto = CreateEvaluacionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del paciente que realiza la evaluación' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateEvaluacionDto.prototype, "idPaciente", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nivel de estrés percibido (Bajo, Medio, Alto)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEvaluacionDto.prototype, "nivelEstres", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Lista de síntomas referidos (ej: Ansiedad, Insomnio)' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateEvaluacionDto.prototype, "sintomas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Narrativa del paciente sobre cómo se siente' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEvaluacionDto.prototype, "narrativa", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del médico si está asignado (opcional)', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateEvaluacionDto.prototype, "idMedico", void 0);
//# sourceMappingURL=create-evaluacion.dto.js.map
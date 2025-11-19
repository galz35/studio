"use client";

import React from 'react';
import type { DatosExtraJSON, DetalleSintoma } from '@/lib/types/solicitud';
import { Chip, ChipGroup } from '../Chip';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const catalogoSintomas = {
    "General": [
        { key: "fiebreSensacion", label: "Siento el cuerpo caliente (temperatura)" },
        { key: "escalofrios", label: "Escalofríos" },
        { key: "malestarGeneral", label: "Malestar general" },
        { key: "fatiga", label: "Cansancio o fatiga" },
    ],
    "Cabeza y cuello": [
        { key: "dolorCabeza", label: "Dolor de cabeza", lateral: true },
        { key: "dolorCuello", label: "Dolor o rigidez de cuello", lateral: true },
        { key: "mareos", label: "Mareos o vértigo" },
    ],
    "Oídos, nariz y garganta": [
        { key: "dolorGarganta", label: "Dolor de garganta" },
        { key: "congestionNasal", label: "Congestión nasal" },
        { key: "tos", label: "Tos" },
        { key: "dolorOido", label: "Dolor de oído", lateral: true },
    ],
    "Ojos": [
        { key: "ojosRojos", label: "Ojos rojos", lateral: true },
        { key: "dolorOcular", label: "Dolor en los ojos", lateral: true },
        { key: "visionBorrosa", label: "Visión borrosa" },
    ],
    "Dientes y encías": [
        { key: "dolorDiente", label: "Dolor de dientes o muelas" },
        { key: "enciasSangrantes", label: "Encías sangrantes" },
    ],
    "Respirar": [
        { key: "dificultadRespirar", label: "Dificultad para respirar" },
        { key: "silbidosPecho", label: "Silbidos en el pecho" },
    ],
    "Latidos y pecho": [
        { key: "dolorPecho", label: "Dolor en el pecho" },
        { key: "palpitaciones", label: "Palpitaciones" },
    ],
    "Estómago e intestinos": [
        { key: "nauseasVomitos", label: "Náuseas o vómitos" },
        { key: "dolorAbdominal", label: "Dolor abdominal" },
        { key: "diarrea", label: "Diarrea" },
        { key: "estrenimiento", label: "Estreñimiento" },
    ],
    "Al orinar": [
        { key: "ardorOrinar", label: "Ardor al orinar" },
        { key: "orinaFrecuente", label: "Necesidad de orinar frecuente" },
    ],
    "Músculos y articulaciones": [
        { key: "dolorMuscular", label: "Dolor muscular", lateral: true },
        { key: "dolorArticular", label: "Dolor en articulaciones", lateral: true },
    ],
    "Piel": [
        { key: "erupcion", label: "Erupción o ronchas" },
        { key: "picazon", label: "Picazón" },
    ],
    "Ánimo y estrés": [
        { key: "ansiedad", label: "Ansiedad o nerviosismo" },
        { key: "tristeza", label: "Tristeza o desánimo" },
        { key: "estres", label: "Estrés" },
    ]
};

const lateralKeys = ["dolorCabeza", "dolorCuello", "dolorOido", "ojosRojos", "dolorOcular", "dolorMuscular", "dolorArticular"];
const urgentes = [
    { key: 'dolorPecho', label: 'Dolor en el pecho' },
    { key: 'faltaAire', label: 'Falta de aire severa' },
    { key: 'desmayo', label: 'Desmayo o confusión' },
    { key: 'sangradoInusual', label: 'Sangrado inusual' },
];
const desencadenantesOptions = ["Esfuerzo", "Comida", "Frío/Calor", "Estrés", "Reposo mejora", "Medicamento ayuda"];


interface Step2Props {
    datosExtra: DatosExtraJSON;
    updateDatosExtra: (field: keyof DatosExtraJSON, value: any) => void;
}

export function Step2_Sintomas({ datosExtra, updateDatosExtra }: Step2Props) {

    const handleCategoryToggle = (cat: string) => {
        const current = new Set(datosExtra.Categorias);
        if (current.has(cat)) current.delete(cat);
        else current.add(cat);
        updateDatosExtra('Categorias', Array.from(current));
    };

    const handleSymptomToggle = (key: string, label: string) => {
        const currentKeys = new Set(datosExtra.SintomasKeys);
        const currentLabels = new Set(datosExtra.Sintomas);
        const currentDetails = { ...datosExtra.Detalles };

        if (currentKeys.has(key)) {
            currentKeys.delete(key);
            currentLabels.delete(label);
            delete currentDetails[key];
        } else {
            currentKeys.add(key);
            currentLabels.add(label);
            currentDetails[key] = { Intensidad: 5 }; // Default intensity
        }

        updateDatosExtra('SintomasKeys', Array.from(currentKeys));
        updateDatosExtra('Sintomas', Array.from(currentLabels));
        updateDatosExtra('Detalles', currentDetails);
    };
    
    const handleDetailChange = (key: string, field: keyof DetalleSintoma, value: any) => {
        const currentDetails = {...datosExtra.Detalles};
        if(currentDetails[key]) {
            currentDetails[key] = { ...currentDetails[key], [field]: value };
            updateDatosExtra('Detalles', currentDetails);
        }
    }
    
    const handleDesencadenanteChange = (key: string, value: string) => {
        const currentDetails = {...datosExtra.Detalles};
        if(currentDetails[key]) {
            const currentSet = new Set(currentDetails[key].Desencadenantes || []);
            if (currentSet.has(value)) currentSet.delete(value);
            else currentSet.add(value);
            handleDetailChange(key, 'Desencadenantes', Array.from(currentSet));
        }
    }
    
    const sintomasVisibles = datosExtra.Categorias.flatMap(cat => catalogoSintomas[cat as keyof typeof catalogoSintomas] || []);

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-2">¿En qué parte del cuerpo?</h3>
                <ChipGroup>
                    {Object.keys(catalogoSintomas).map(cat => (
                        <Chip key={cat} multi active={datosExtra.Categorias.includes(cat)} onClick={() => handleCategoryToggle(cat)}>
                            {cat}
                        </Chip>
                    ))}
                </ChipGroup>
            </div>
            
            {datosExtra.Categorias.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Tus Síntomas</h3>
                    <ChipGroup>
                        {sintomasVisibles.length > 0 ? sintomasVisibles.map(s => (
                             <Chip key={s.key} multi active={datosExtra.SintomasKeys.includes(s.key)} onClick={() => handleSymptomToggle(s.key, s.label)}>
                                {s.label}
                            </Chip>
                        )) : <p className='text-sm text-muted-foreground'>Selecciona una categoría para ver los síntomas.</p>}
                    </ChipGroup>
                </div>
            )}
            
            {datosExtra.SintomasKeys.length > 0 && (
                 <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Detalles de los Síntomas</h3>
                    {datosExtra.SintomasKeys.map(key => {
                        const sintomaLabel = datosExtra.Sintomas[datosExtra.SintomasKeys.indexOf(key)];
                        const detalle = datosExtra.Detalles[key] || {};
                        return (
                            <Card key={key} className="bg-slate-50">
                                <CardHeader className='pb-2'>
                                    <div className='flex justify-between items-center'>
                                        <CardTitle className='text-md'>{sintomaLabel}</CardTitle>
                                        <Button variant='ghost' size='icon' onClick={() => handleSymptomToggle(key, sintomaLabel)}><X className='w-4 h-4 text-destructive'/></Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium">Intensidad</label>
                                            <div className='flex items-center gap-4'>
                                                <Slider defaultValue={[5]} min={0} max={10} step={1} onValueChange={(v) => handleDetailChange(key, 'Intensidad', v[0])} />
                                                <Badge variant="secondary" className='w-12 justify-center'>{detalle.Intensidad || 5}/10</Badge>
                                            </div>
                                        </div>
                                         {lateralKeys.includes(key) && (
                                            <div>
                                                <label className="text-sm font-medium">Lado</label>
                                                 <ChipGroup>
                                                    <Chip active={detalle.Lado === 'Izquierdo'} onClick={() => handleDetailChange(key, 'Lado', 'Izquierdo')}>Izquierdo</Chip>
                                                    <Chip active={detalle.Lado === 'Derecho'} onClick={() => handleDetailChange(key, 'Lado', 'Derecho')}>Derecho</Chip>
                                                    <Chip active={detalle.Lado === 'Ambos'} onClick={() => handleDetailChange(key, 'Lado', 'Ambos')}>Ambos</Chip>
                                                </ChipGroup>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-sm font-medium">Duración</label>
                                             <ChipGroup>
                                                <Chip active={detalle.Duracion === 'Horas'} onClick={() => handleDetailChange(key, 'Duracion', 'Horas')}>Horas</Chip>
                                                <Chip active={detalle.Duracion === 'Días'} onClick={() => handleDetailChange(key, 'Duracion', 'Días')}>Días</Chip>
                                                <Chip active={detalle.Duracion === 'Semanas'} onClick={() => handleDetailChange(key, 'Duracion', 'Semanas')}>Semanas</Chip>
                                                <Chip active={detalle.Duracion === 'Meses'} onClick={() => handleDetailChange(key, 'Duracion', 'Meses')}>Meses</Chip>
                                            </ChipGroup>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Frecuencia</label>
                                            <ChipGroup>
                                                <Chip active={detalle.Frecuencia === 'Ocasional'} onClick={() => handleDetailChange(key, 'Frecuencia', 'Ocasional')}>Ocasional</Chip>
                                                <Chip active={detalle.Frecuencia === 'A ratos'} onClick={() => handleDetailChange(key, 'Frecuencia', 'A ratos')}>A ratos</Chip>
                                                <Chip active={detalle.Frecuencia === 'Frecuente'} onClick={() => handleDetailChange(key, 'Frecuencia', 'Frecuente')}>Frecuente</Chip>
                                            </ChipGroup>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">¿Algo lo provoca o mejora?</label>
                                        <ChipGroup>
                                            {desencadenantesOptions.map(d => <Chip key={d} multi active={detalle.Desencadenantes?.includes(d)} onClick={() => handleDesencadenanteChange(key, d)}>{d}</Chip>)}
                                        </ChipGroup>
                                    </div>
                                    <Textarea placeholder='Descripción breve (opcional)...' value={detalle.Notas || ''} onChange={(e) => handleDetailChange(key, 'Notas', e.target.value)} />
                                </CardContent>
                            </Card>
                        )
                    })}
                 </div>
            )}
        </div>
    );
}

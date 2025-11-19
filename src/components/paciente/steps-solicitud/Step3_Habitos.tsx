"use client";

import React from 'react';
import type { DatosExtraJSON } from '@/lib/types/solicitud';
import { Chip, ChipGroup } from '../Chip';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Step3Props {
    datosExtra: DatosExtraJSON;
    updateDatosExtra: (field: keyof DatosExtraJSON, value: any) => void;
    aptoLaboral: boolean | null;
    setAptoLaboral: (value: boolean) => void;
}

export function Step3_Habitos({ datosExtra, updateDatosExtra, aptoLaboral, setAptoLaboral }: Step3Props) {
    
    const handleAlergiaChange = (value: boolean) => {
        updateDatosExtra('Alergia', { ...datosExtra.Alergia, activa: value });
    }
    const handleAlergiaDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateDatosExtra('Alergia', { ...datosExtra.Alergia, descripcion: e.target.value });
    }
    const handleSuenoChange = (value: any) => {
        updateDatosExtra('Habitos', { ...datosExtra.Habitos, sueno: value });
    }
    const handleHidratacionChange = (value: any) => {
        updateDatosExtra('Habitos', { ...datosExtra.Habitos, hidratacion: value });
    }

    return (
        <div className="space-y-8">
             <div>
                <h3 className="text-lg font-semibold mb-2">¿Tienes alergia activa hoy?</h3>
                <ToggleGroup type="single" value={String(datosExtra.Alergia.activa)} onValueChange={(v) => handleAlergiaChange(v === 'true')}>
                    <ToggleGroupItem value="true" aria-label="Sí">Sí</ToggleGroupItem>
                    <ToggleGroupItem value="false" aria-label="No">No</ToggleGroupItem>
                </ToggleGroup>

                {datosExtra.Alergia.activa === true && (
                    <div className='mt-4 animate-in fade-in-50'>
                        <label className='font-medium text-sm'>¿A qué?</label>
                        <Textarea placeholder="Describe tus alergias..." className="mt-2" onChange={handleAlergiaDescChange} value={datosExtra.Alergia.descripcion || ''}/>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">¿Cómo dormiste?</h3>
                 <ChipGroup>
                    <Chip active={datosExtra.Habitos.sueno === 'Bien'} onClick={() => handleSuenoChange('Bien')}>Bien</Chip>
                    <Chip active={datosExtra.Habitos.sueno === 'Regular'} onClick={() => handleSuenoChange('Regular')}>Regular</Chip>
                    <Chip active={datosExtra.Habitos.sueno === 'Mal'} onClick={() => handleSuenoChange('Mal')}>Mal</Chip>
                    <Chip active={datosExtra.Habitos.sueno === 'Prefiero no decir'} onClick={() => handleSuenoChange('Prefiero no decir')}>Prefiero no decir</Chip>
                </ChipGroup>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold mb-2">¿Ha bebido agua hoy?</h3>
                 <ChipGroup>
                    <Chip active={datosExtra.Habitos.hidratacion === 'Sí'} onClick={() => handleHidratacionChange('Sí')}>Sí</Chip>
                    <Chip active={datosExtra.Habitos.hidratacion === 'Poco'} onClick={() => handleHidratacionChange('Poco')}>Poco</Chip>
                    <Chip active={datosExtra.Habitos.hidratacion === 'Aún no'} onClick={() => handleHidratacionChange('Aún no')}>Aún no</Chip>
                </ChipGroup>
            </div>

             <div>
                <h3 className="text-lg font-semibold mb-2">¿Estás en condiciones de trabajar?</h3>
                <ToggleGroup type="single" value={String(aptoLaboral)} onValueChange={(v) => setAptoLaboral(v === 'true')}>
                    <ToggleGroupItem value="true" aria-label="Sí">Sí</ToggleGroupItem>
                    <ToggleGroupItem value="false" aria-label="No">No</ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    );
}

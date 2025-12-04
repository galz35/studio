"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { MedicoService } from '@/lib/services/medico.service';
import type { ExamenMedico, Paciente } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, FilePenLine, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

type ExamenConPaciente = ExamenMedico & { paciente: Paciente };

export default function ExamenesMedicosPage() {
  const { pais } = useAuth();
  const { toast } = useToast();
  const [examenes, setExamenes] = useState<ExamenConPaciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamen, setSelectedExamen] = useState<ExamenConPaciente | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  useEffect(() => {
    if (pais) {
      MedicoService.getExamenes({ pais })
        .then(data => {
          setExamenes(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error loading exams", err);
          setLoading(false);
        });
    }
  }, [pais, isRegisterModalOpen]); // Re-fetch on country change or after a modal closes

  const handleRegisterResult = (idExamen: string, resultado: string) => {
    // Mock update - In real app, call API to update exam result
    // await MedicoService.updateExamen(idExamen, { resultado, estado: 'ENTREGADO' });
    setExamenes(prev => prev.map(ex => ex.id === idExamen ? { ...ex, estadoExamen: 'ENTREGADO', resultadoResumen: resultado, fechaResultado: new Date().toISOString().split('T')[0] } : ex));
    toast({ title: 'Resultado Registrado', description: 'El resultado del examen se ha guardado.' });
    setIsRegisterModalOpen(false);
    setSelectedExamen(null);
  };

  const handleBulkUpload = (file: File) => {
    if (!file) return;
    toast({ title: 'Procesando archivo...', description: `Se ha iniciado la carga masiva de ${file.name}` });
    // Simulate upload and processing
    setTimeout(() => {
      toast({ title: 'Carga Masiva Completada', description: 'Los resultados se han registrado exitosamente.' });
      setIsBulkModalOpen(false);
    }, 2000);
  }

  const columns = [
    { accessor: 'fechaSolicitud', header: 'F. Solicitud' },
    { accessor: (row: ExamenConPaciente) => row.paciente.nombreCompleto, header: 'Paciente' },
    { accessor: 'tipoExamen', header: 'Tipo' },
    { accessor: 'laboratorio', header: 'Laboratorio' },
    {
      accessor: 'estadoExamen',
      header: 'Estado',
      cell: (row: ExamenConPaciente) => (
        <Badge variant={row.estadoExamen === 'ENTREGADO' ? 'default' : 'secondary'} className={cn(row.estadoExamen === 'ENTREGADO' && "bg-accent text-accent-foreground")}>
          {row.estadoExamen}
        </Badge>
      ),
    },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: (row: ExamenConPaciente) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedExamen(row); setIsRegisterModalOpen(true); }}>
            {row.estadoExamen === 'PENDIENTE' ? <FilePenLine className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <div>Cargando exámenes...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">Gestión de Exámenes Médicos</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className='w-full md:w-auto'><FilePenLine /> Registrar Resultado Manual</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Registro Manual de Resultado</DialogTitle></DialogHeader>
              <p className="text-muted-foreground text-sm">Para registrar un resultado, búsquelo en la tabla de abajo y haga clic en el ícono de lápiz en la columna de acciones.</p>
            </DialogContent>
          </Dialog>
          <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
            <DialogTrigger asChild>
              <Button className='w-full md:w-auto'><UploadCloud /> Carga Masiva (Excel)</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Carga Masiva de Resultados desde Excel</DialogTitle></DialogHeader>
              <form id="bulk-upload-form" onSubmit={(e) => {
                e.preventDefault();
                const fileInput = e.currentTarget.elements.namedItem('excel-file') as HTMLInputElement;
                if (fileInput.files && fileInput.files.length > 0) {
                  handleBulkUpload(fileInput.files[0]);
                } else {
                  toast({ variant: 'destructive', title: 'Error', description: 'Por favor, seleccione un archivo.' });
                }
              }}>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="excel-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click para subir</span> o arrastra y suelta</p>
                        <p className="text-xs text-muted-foreground">Archivo .XLSX o .CSV</p>
                      </div>
                      <Input id="excel-file" name="excel-file" type="file" className="hidden" accept=".xlsx, .csv" />
                    </label>
                  </div>
                  <a href="#" className="text-sm text-primary hover:underline">Descargar plantilla de ejemplo</a>
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="ghost">Cancelar</Button></DialogClose>
                  <Button type="submit">Procesar Archivo</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Listado de Exámenes</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={examenes} filterColumn="tipoExamen" filterPlaceholder="Filtrar por tipo..." />
        </CardContent>
      </Card>

      {selectedExamen && (
        <Dialog open={isRegisterModalOpen} onOpenChange={(open) => { if (!open) setSelectedExamen(null); setIsRegisterModalOpen(open); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedExamen.estadoExamen === 'PENDIENTE' ? 'Registrar Resultado' : 'Ver Resultado'}</DialogTitle>
            </DialogHeader>
            <form id="examen-form" onSubmit={(e) => {
              e.preventDefault();
              if (selectedExamen.estadoExamen === 'PENDIENTE') {
                const formData = new FormData(e.currentTarget);
                const resultado = formData.get('resultado') as string;
                handleRegisterResult(selectedExamen.id!, resultado);
              } else {
                setIsRegisterModalOpen(false);
              }
            }}>
              <div className="space-y-4 py-4">
                <p><strong>Paciente:</strong> {selectedExamen.paciente.nombreCompleto}</p>
                <p><strong>Tipo de Examen:</strong> {selectedExamen.tipoExamen}</p>
                <p><strong>Fecha Solicitud:</strong> {selectedExamen.fechaSolicitud}</p>
                <Textarea
                  name="resultado"
                  rows={5}
                  placeholder="Ingrese el resumen del resultado..."
                  defaultValue={selectedExamen.resultadoResumen}
                  readOnly={selectedExamen.estadoExamen === 'ENTREGADO'}
                  required={selectedExamen.estadoExamen === 'PENDIENTE'}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="ghost">Cerrar</Button></DialogClose>
                {selectedExamen.estadoExamen === 'PENDIENTE' && (
                  <Button type="submit">Guardar Resultado</Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}

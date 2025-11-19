import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PrimerAccesoPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Primer Acceso</CardTitle>
        <CardDescription>Esta funcionalidad está en construcción.</CardDescription>
      </CardHeader>
      <CardContent className='text-center'>
        <p className="text-muted-foreground">Aquí podrá configurar su cuenta por primera vez.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/login">Volver a Iniciar Sesión</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

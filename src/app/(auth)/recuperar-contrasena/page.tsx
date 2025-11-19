import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RecuperarContrasenaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar Contraseña</CardTitle>
        <CardDescription>Esta funcionalidad está en construcción.</CardDescription>
      </CardHeader>
      <CardContent className='text-center'>
        <p className="text-muted-foreground">Aquí podrá iniciar el proceso para recuperar su contraseña.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/login">Volver a Iniciar Sesión</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

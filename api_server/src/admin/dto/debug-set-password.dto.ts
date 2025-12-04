import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DebugSetPasswordDto {
    @ApiProperty({ example: '500708', description: 'Carnet del usuario' })
    @IsString()
    @IsNotEmpty()
    carnet: string;

    @ApiProperty({ example: 'newpassword123', description: 'Nueva contraseña' })
    @IsString()
    @IsNotEmpty()
    newPass: string;
}

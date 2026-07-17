interface TableInfo {
    name: string;
    gender: 'm' | 'f'; // m = masculino, f = femenino
}

export class DbErrorHandler {
    private static readonly TABLE_MAP: Record<string, TableInfo> = {
        'usr_users': { name: 'usuarios', gender: 'm' },
    };

    public static handle(error: any): string {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            const detail = error.parent?.detail || error.parent?.message || "";
            const tableNameMatch = detail.match(/table "([^"]+)"|table `([^`]+)`/);
            const tableName = tableNameMatch ? (tableNameMatch[1] || tableNameMatch[2]) : null;

            const info = tableName ? this.TABLE_MAP[tableName] : null;

            if (info) {
                // Si es femenino 'f', usamos 'asociadas', si es masculino 'm', 'asociados'
                const suffix = info.gender === 'f' ? 'asociadas' : 'asociados';
                return `No se puede eliminar el registro porque tiene ${info.name} ${suffix}.`;
            }

            // Fallback si la tabla no está en nuestro mapa
            return "No se puede eliminar el registro porque tiene datos vinculados en otras tablas.";
        }

        return error.message || "Error inesperado en la base de datos.";
    }
}
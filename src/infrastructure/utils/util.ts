export function parseQueryParamToInt(value: string | null | undefined): number | undefined {
  if (value == null) {
    return undefined;
  }
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

export function getStringFromQuery(value: any): string | undefined {
  return typeof value === 'string' ? (value.trim() || undefined) : undefined;
}
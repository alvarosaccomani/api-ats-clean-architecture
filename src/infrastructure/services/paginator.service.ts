import { parseQueryParamToInt } from "../../infrastructure/utils/util";

export function paginator(items: any[], rawPage: string | null | undefined = '1', rawPerPage: string | null | undefined = '10') {
  // Convertimos y validamos los parámetros
  const page = parseQueryParamToInt(rawPage) ?? 1;
  const perPage = parseQueryParamToInt(rawPerPage) ?? 10;

  // Aseguramos que sean positivos y razonables
  const clampedPage = Math.max(1, page);
  const clampedPerPage = Math.max(1, Math.min(perPage, 100)); // límite máximo opcional

  const offset = (clampedPage - 1) * clampedPerPage;

  // Añadimos índice (empezando en 1)
  const itemsWithIndex = items.map((e, idx) => ({
    ...e,
    index: idx + 1
  }));

  const paginatedItems = itemsWithIndex.slice(offset, offset + clampedPerPage);
  const totalPages = Math.ceil(items.length / clampedPerPage);

  return {
    page: clampedPage,
    item: paginatedItems.length > 0 ? paginatedItems[0].index : 0,
    itemOf: paginatedItems.length > 0 ? paginatedItems[paginatedItems.length - 1].index : 0,
    perPage: clampedPerPage,
    prePage: clampedPage > 1 ? clampedPage - 1 : null,
    nextPage: clampedPage < totalPages ? clampedPage + 1 : null,
    total: items.length,
    totalPages: totalPages,
    data: paginatedItems
  };
}
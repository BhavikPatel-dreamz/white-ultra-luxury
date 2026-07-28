export const PRODUCT_PAGE_SIZE = 12;

export type PageSearchParams = {
  page?: string | string[];
};

export function getPageFromSearchParams(searchParams: PageSearchParams) {
  const rawPage = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const page = Number(rawPage ?? "1");

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function getOffsetFromPage(page: number, limit = PRODUCT_PAGE_SIZE) {
  return (page - 1) * limit;
}

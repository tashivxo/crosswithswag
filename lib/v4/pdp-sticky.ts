/** The sticky ADD TO CART bar hides while the main ADD TO CART is on screen, so it never covers it. */
export function isStickyBarHidden(mainAtcIntersecting: boolean | null | undefined): boolean {
  return mainAtcIntersecting === true;
}

export declare type TCoords = [number | null, number | null];
export interface IOptions {
    cancelOnUserAction?: boolean;
    easing?: (t: number) => number;
    elementToScroll?: Element | Window;
    horizontalOffset?: number;
    maxDuration?: number;
    minDuration?: number;
    passive?: boolean;
    speed?: number;
    verticalOffset?: number;
}
declare function animateScrollTo(y: number, userOptions?: IOptions): any;
declare function animateScrollTo(coords: TCoords, userOptions?: IOptions): any;
declare function animateScrollTo(scrollToElement: Element, userOptions?: IOptions): any;
export default animateScrollTo;

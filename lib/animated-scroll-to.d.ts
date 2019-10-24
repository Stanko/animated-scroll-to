export declare type TCoords = [number | null, number | null];
export interface IUserOptions {
    cancelOnUserAction?: boolean;
    easing?: (t: number) => number;
    elementToScroll?: Element | Window;
    horizontalOffset?: number;
    maxDuration?: number;
    minDuration?: number;
    speed?: number;
    verticalOffset?: number;
}
declare function animateScrollTo(y: number, userOptions?: IUserOptions): any;
declare function animateScrollTo(coords: TCoords, userOptions?: IUserOptions): any;
declare function animateScrollTo(scrollToElement: Element, userOptions?: IUserOptions): any;
export default animateScrollTo;

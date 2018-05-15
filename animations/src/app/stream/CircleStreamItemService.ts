import {Injectable} from "@angular/core";
import {StreamItemContainer} from "./StreamItem";
import {Circle, Element, ShapeOptions} from "@progress/kendo-drawing";
import {Circle as GeomCircle} from "@progress/kendo-drawing/geometry";
import {RanboShapeOptionsService} from "./RanboShapeOptionsService";
import {StreamItemFactory} from "./StreamItemFactory";

@Injectable()
export class CircleStreamItemService implements StreamItemFactory{


    constructor() {
    }

    createStreamItem(options?: ShapeOptions): StreamItemContainer {
        return new StreamItemContainer(this.createCircle(options));
    }

    private createCircle(options: ShapeOptions): Element {
        // Create the circle geometry and element
        return new Circle(new GeomCircle([25, 25], 20),
            options ||
            RanboShapeOptionsService.createStreamOption())
    }
}
import {Component} from "@angular/core";
import './generative.source.component.htm';
import {SingleStreamItem} from "../../../stream/SingleStreamItem";
import {StreamItem} from "../../../stream/StreamItem";
import {Observer} from "rxjs/Observer";
import {Observable} from "rxjs/Observable";
import {Predicate} from "../../../stream/Predicate";
import {Function} from "../../../stream/Function";
import {Element} from "@progress/kendo-drawing";
import {Scheduler} from "rxjs/Rx";
import {SquareStreamItemService} from "../../../stream/SquareStreamItemService";
import {CircleStreamItemService} from "../../../stream/CircleStreamItemService";
import {TriangleStreamItemService} from "../../../stream/TriangleStreamItemService";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
    selector: 'base-view',
    template: require('./generative.source.component.htm')
})
export class GenerativeSourceComponent {


    mapOne: Function<StreamItem, StreamItem> = {
        apply: (streamItem: StreamItem) => new SingleStreamItem(
            streamItem.element.flatMap((element: Element) => this.hip2B.createStreamItem(()=>{return{
                    fill: element.options.get('fill'),
                    stroke: element.options.get('stroke'),
                }}).element
            ))
    };

    flatMapOne: Function<StreamItem, Observable<StreamItem>> = {
        apply: (streamItem: StreamItem) => Observable.create((observer: Observer<StreamItem>) => {
            streamItem.element.subscribe((element: Element) => {
                let triangle = ()=>
                    this.triangleFactory.createStreamItem(()=>{
                        return {
                            fill: element.options.get('fill'),
                                stroke: element.options.get('stroke'),
                        }
                    });
                observer.next(triangle());
                Observable.interval(750, Scheduler.async)
                    .take(4)
                    .subscribe(_ => observer.next(triangle()),
                        observer.error,
                        observer.complete);
            });
        })
    };
    filterOne: Predicate<StreamItem> = {
        test: (item: StreamItem) => item.identifier % 2 === 0
    };
    private sourceOutputSubject = new BehaviorSubject(null);
    sourceOutput = this.sourceOutputSubject.filter(item => !!item);

    private mapSubject = new BehaviorSubject(null);
    mapOutputStream = this.mapSubject.filter(item => !!item);

    private flatMapSubject = new BehaviorSubject(null);
    flatMapOutputStream = this.flatMapSubject.filter(item => !!item);

    private streamSourceInputSubject = new BehaviorSubject<StreamItem>(null);
    streamSourceInput = this.streamSourceInputSubject.filter(item => !!item);

    constructor(private triangleFactory: TriangleStreamItemService,
                private hip2B: SquareStreamItemService,
                private circleService: CircleStreamItemService) {
    }

    sourceComplete(item: StreamItem) {
        this.sourceOutputSubject.next(item);
    }


    flatMapOneComplete(steamItem: StreamItem) {
        this.flatMapSubject.next(steamItem)
    }

    mapOneComplete(steamItem: StreamItem) {
        this.mapSubject.next(steamItem)
    }

    filterOneComplete(steamItem: StreamItem) {

    }

    startStreamOne(): void {
        this.streamSourceInputSubject.next(this.circleService.createStreamItem());
    }

}
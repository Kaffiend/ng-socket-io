import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share'; 

import * as io from 'socket.io-client';

import { SocketIoConfig } from './socketIoConfig';

@Injectable()
export class WrappedSocket {
    subscribersCounter : number = 0;
    ioSocket: any;

    constructor(config: SocketIoConfig) {
        const url: string = config.url || '';
        const options: any = config.options || {};
        this.ioSocket = io(url, options);
    }

    on(eventName: string, callback: Function) {
        this.ioSocket.on(eventName, callback);
    }

    once(eventName: string, callback: Function) {
        this.ioSocket.once(eventName, callback);
    }

    connect() {
        return this.ioSocket.connect();
    }

    disconnect(close?: any) {
        return this.ioSocket.disconnect.apply(this.ioSocket, arguments);
    }

    emit(eventName: string, data?: any, callback?: Function) {
        return this.ioSocket.emit.apply(this.ioSocket, arguments);
    }

    removeListener(eventName: string, callback?: Function) {
        return this.ioSocket.removeListener.apply(this.ioSocket, arguments);
    }

    removeAllListeners(eventName?: string) {
        return this.ioSocket.removeAllListeners.apply(this.ioSocket, arguments);
    }

    /** create an Observable from an event */
    fromEvent<T>(eventName: string): Observable<T> {
        this.subscribersCounter++;
        return Observable.create( (observer: any) => {
             this.ioSocket.on(eventName, (data: T) => {
                 observer.next(data);
             });
             return () => {
                 if (this.subscribersCounter === 1)
                    this.ioSocket.removeListener(eventName);
            };
        }).share();
    }

}
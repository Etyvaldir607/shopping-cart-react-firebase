import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HttpService {


    static readonly CONTENT_TYPE: string = 'Content-Type';
    static readonly APPLICATION_JSON_UTF8: string = 'application/json; charset=utf-8';
    static readonly APPLICATION_X_WWW_FORM_URLENCODED: string = 'application/x-www-form-urlencoded';

    constructor(private readonly http: HttpClient) {
    }

    private realPath(url: string): string {
        return environment.production && url.indexOf("http://") == -1 && url.indexOf("https://") ? environment.subPath + url : url;
    }

    public postJson<T>(url: string, body: any | null, blockui = false): Observable<T> {
        let headersAux = new HttpHeaders();
        headersAux = headersAux.set(HttpService.CONTENT_TYPE, HttpService.APPLICATION_JSON_UTF8);
        return this.http.post<T>(this.realPath(url), body, {
            headers: headersAux,
            params: { blockui: blockui.toString() }
        });
    }

    public getJson<T>(url: string, blockui = false): Observable<T> {
        let headersAux = new HttpHeaders();
        headersAux = headersAux.set(HttpService.CONTENT_TYPE, HttpService.APPLICATION_JSON_UTF8);
        return this.http.get<T>(this.realPath(url), { headers: headersAux, responseType: 'json', params: { blockui: blockui.toString() } });
    }

    public putJson<T>(url: string, body: any | null, blockui = false): Observable<T> {
        let headersAux = new HttpHeaders();
        headersAux = headersAux.set(HttpService.CONTENT_TYPE, HttpService.APPLICATION_JSON_UTF8);
        return this.http.put<T>(this.realPath(url), body, { headers: headersAux, responseType: 'json', params: { blockui: blockui.toString() } });
    }

}

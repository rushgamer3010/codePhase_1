import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkItemService {
  private dataUrl = 'assets/data/cosmicData.json';  // Updated JSON file

  constructor(private http: HttpClient) {}

  // Fetch all cosmic data
  getAllWorkItems(): Observable<any> {
    return this.http.get(this.dataUrl);
  }

  // Fetch work item details by cosmicId
  getDetailsByCosmicId(cosmicId: string, cosmicData: any[]): any {
    return cosmicData.find((item) => item.cosmicId === cosmicId);
  }
}

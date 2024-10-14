import { Component, OnInit } from '@angular/core';
import { WorkItemService } from '../work-item.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-work-item',
  templateUrl: './work-item.component.html',
  styleUrls: ['./work-item.component.css'],
})
export class WorkItemComponent implements OnInit {
  cosmicId: string = ''; // CosmicId entered by user
  selectedWorkItem: any = null; // To store the selected work item
  cosmicData: any[] = []; // Array to hold all cosmic data fetched from JSON
  showModal: boolean = false; // Flag to control modal display

  // Checkbox values
  workItemDetailsSelected: boolean = true;
  workItemNotesSelected: boolean = true;
  workItemAttachmentsSelected: boolean = true;
  workItemAuditHistorySelected: boolean = true;

  constructor(private workItemService: WorkItemService) {}

  ngOnInit() {
    // Fetch all cosmic data when the component initializes
    this.workItemService.getAllWorkItems().subscribe((data) => {
      this.cosmicData = data.cosmicData; // Store the fetched cosmic data
    });
  }

  // Preview work item details based on entered cosmicId
  preview() {
    // Get the work item by cosmicId
    this.selectedWorkItem = this.workItemService.getDetailsByCosmicId(this.cosmicId, this.cosmicData);

    if (this.selectedWorkItem) {
      this.showModal = true; // Open the modal if work item found
    } else {
      alert('CosmicId not found!'); // Handle case if cosmicId is not found
    }
  }

  // Close the modal
  closeModal() {
    this.showModal = false;
  }

  // Download the selected data as PDF using jsPDF
  downloadPDF() {
    const doc = new jsPDF();

    // Add Work Item Details section
    if (this.workItemDetailsSelected && this.selectedWorkItem) {
      doc.setFontSize(14);
      doc.text('Work Item Details:', 10, 20);

      const details = this.selectedWorkItem.summary[0];
      doc.text(`Cosmic ID: ${this.selectedWorkItem.cosmicId}`, 10, 30);
      doc.text(`Parent Case ID: ${this.selectedWorkItem.parentCaseId}`, 10, 40);
      doc.text(`Business Unit: ${this.selectedWorkItem.businessUnit}`, 10, 50);
      doc.text(`Focus Name: ${this.selectedWorkItem.focusName}`, 10, 60);
      doc.text(`Sharing Category: ${details.sharingCategory}`, 10, 70);
      doc.text(`Risk Type: ${details.riskType[0].label}`, 10, 80);
      doc.text(`Summary: ${details.summaryDescription}`, 10, 90);
      doc.addPage();
    }

    // Add Work Item Notes section
    if (this.workItemNotesSelected && this.selectedWorkItem?.WorkItemNotes?.length > 0) {
      doc.setFontSize(14);
      doc.text('Work Item Notes:', 10, 20);

      this.selectedWorkItem.WorkItemNotes.forEach((note: { NoteDate: string; EnteredBy: string; RelatedAction: string }, index: number) => {
        const startY = 30 + index * 30;  // Space out the notes to avoid overlap
        doc.text(`Note Date: ${note.NoteDate}`, 10, startY);
        doc.text(`Entered By: ${note.EnteredBy}`, 10, startY + 10);
        doc.text(`Related Action: ${note.RelatedAction}`, 10, startY + 20);
      });
      doc.addPage();
    }

    // Add Work Item Attachments section
    if (this.workItemAttachmentsSelected && this.selectedWorkItem?.WorkItemAttachments?.length > 0) {
      doc.setFontSize(14);
      doc.text('Work Item Attachments:', 10, 20);

      this.selectedWorkItem.WorkItemAttachments.forEach((attachment: { FileName: string; AttachDate: string; SizeKB: number }, index: number) => {
        const startY = 30 + index * 30;
        doc.text(`File Name: ${attachment.FileName}`, 10, startY);
        doc.text(`Attach Date: ${attachment.AttachDate}`, 10, startY + 10);
        doc.text(`Size (KB): ${attachment.SizeKB}`, 10, startY + 20);
      });
      doc.addPage();
    }

    // Add Work Item Audit History section
    if (this.workItemAuditHistorySelected && this.selectedWorkItem?.WorkItemAuditHistory?.length > 0) {
      doc.setFontSize(14);
      doc.text('Work Item Audit History:', 10, 20);

      this.selectedWorkItem.WorkItemAuditHistory.forEach((audit: { Date: string; Action: string; PerformedBy: string }, index: number) => {
        const startY = 30 + index * 30;
        doc.text(`Date: ${audit.Date}`, 10, startY);
        doc.text(`Action: ${audit.Action}`, 10, startY + 10);
        doc.text(`Performed By: ${audit.PerformedBy}`, 10, startY + 20);
      });
    }

    // Save the PDF
    doc.save(`WorkItem_${this.cosmicId}.pdf`);
  }
}

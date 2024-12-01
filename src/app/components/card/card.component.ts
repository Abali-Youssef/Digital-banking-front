import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardModalComponent } from './modals/card-modal/card-modal.component';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Card } from '../../services/models/card';
import { EditCardModalComponent } from './modals/edit-card-modal/edit-card-modal.component';
import { CardService } from '../../services/card-service/card-service.service';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  cards!: Array<Card>;
  currentPage: number = 1;
  totalPage!: number;
  totalElements!: number;
  pageSize!: number;
  errorMessage!: string;
  searchFormGroup!: FormGroup;
  selectAll: boolean = false;
  selectedRowsId: Array<string> = [];
  constructor(public auth: LoginService, private toastr: ToastrService, private cardservice: CardService, private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control("")
    })
    this.getCards(this.currentPage);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CardModalComponent, {
      width: '400px',  // Set the width of the modal
      disableClose: true,
    });

    // Optional: You can subscribe to the afterClosed() event
    dialogRef.afterClosed().subscribe(result => {
      this.getCards(this.currentPage)
    });
  }
  onEditCard(card: Card): void {
    console.log(card);
    const dialogRef = this.dialog.open(EditCardModalComponent, {
      width: '400px',
      data: card, // Pass the card object to the modal
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getCards(this.currentPage)
    });
  }

  getCards(page: number) {
    let kw = this.searchFormGroup.value.keyword.toLowerCase();
    this.cards = [];
    this.cardservice.getCards(kw, page).subscribe({
      next: (response) => {
        this.cards = response.cards;
        this.currentPage = response.currentPage;
        this.pageSize = response.pageSize;
        this.totalPage = response.totalPage;
        this.totalElements = response.totalElements;
      },
      error: (err) => {
        this.errorMessage = err.message;
        if (err.error?.exception) this.toastr.error(err.error?.exception);
        if (err.error?.error) this.toastr.error("Something went wrong! please try again");

      }
    });

  }
  handleDeleteCard(c: Card) {
    this.selectedRowsId = [c.id];
    Swal.fire({
      title: "Delete",
      text: "Do you want to delete this card?",

      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        this.cardservice.deleteCard(this.selectedRowsId).subscribe({
          next: (resp) => {
            this.toastr.success("Deleted successfully");
            this.getCards(1);
          },
          error: err => {
            this.errorMessage = err.message;
            if (err.error?.exception) this.toastr.error(err.error?.exception);
            if (err.error?.error) this.toastr.error("Something went wrong! please try again");
          }
        })

      } else {
        this.selectedRowsId = [];
        if (this.selectAll) this.selectAll = !this.selectAll;
      }
    });
  }
  handleSelectAllRows() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.selectedRowsId = this.cards.map(c => c.id);
    } else {
      this.selectedRowsId = [];
    }
  }
  handleSelectRow(id: string): void {
    if (!this.selectedRowsId.includes(id)) {
      this.selectedRowsId.push(id);
    } else {
      this.selectedRowsId = this.selectedRowsId.filter(listId => id != listId);
    }
    if (this.selectedRowsId.length == this.pageSize) {
      this.selectAll = true
    } else {
      this.selectAll = false
    }
  }
  multipleDeleteCards() {
    if (this.selectedRowsId.length == 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a card to delete",
      });
    } else {
      Swal.fire({
        title: "Delete",
        text: "Do you want to delete those cards?",

        showCancelButton: true,
        confirmButtonText: "Delete",
      }).then((result) => {
        if (result.isConfirmed) {
          this.cardservice.deleteCard(this.selectedRowsId).subscribe({
            next: (resp) => {
              this.getCards(1);
              this.toastr.success("Deleted successfully");
            },
            error: err => {
              this.errorMessage = err.message;
              if (err.error?.exception) this.toastr.error(err.error?.exception);

            }
          })

        } else {
          this.selectedRowsId = [];
          if (this.selectAll) this.selectAll = !this.selectAll;

        }
      });
    }

  }
  PreviousPage() {
    console.log(this.currentPage);
    if (this.currentPage - 1 >= 1) {
      this.currentPage = this.currentPage - 1;
      this.getCards(this.currentPage)
    }
  }
  nextPage() {
    if (this.currentPage + 1 <= this.totalPage) {
      this.currentPage = this.currentPage + 1;
      this.getCards(this.currentPage)
    }
  }



}

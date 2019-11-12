import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { Booking } from '../../../booking/shared/booking.model'
import { Rental } from '../../shared/rental.model';
import { HelperService } from '../../../common/service/helper.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { BookingService } from '../../../booking/shared/booking.service'
import * as moment from 'moment'


@Component({
  selector: 'bwm-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})
export class RentalDetailBookingComponent implements OnInit {

  @Input() rental: Rental;


  newBooking: Booking;
  modalRef: any;


  daterange: any = {};
  bookedOutDates: any[] = [];
  errors: any[] = []

  options: any = {
    locale: { format: Booking.DATE_FORMAT },
    alwaysShowCalendars: false,
    opens: 'left',
    isInvalidDate: this.checkForInvalidDates.bind(this)
};
  
  constructor(private helper: HelperService, 
              private modalService: NgbModal,
              private bookingService: BookingService,
              private toastr: ToastrService
  ) {}


    ngOnInit() {
      this.newBooking = new Booking();
      this.getBookedOutDates();
    }

    private checkForInvalidDates(date) {
      return this.bookedOutDates.includes(this.helper.formatBookingDate(date)) || date.diff(moment(), 'days') < 0;
      
    }

    private getBookedOutDates() {
      const bookings: Booking[] = this.rental.bookings
      if (bookings && bookings.length > 0) {
        bookings.forEach((booking: Booking) => {
          console.log(booking)
          const dateRange = this.helper.getBookingRangeOfDates(booking.startAt, booking.endAt)
          this.bookedOutDates.push(...dateRange)
        })
      }
    }

    private addNewBookedDates(bookingData) {
      const dateRange = this.helper.getBookingRangeOfDates(bookingData.startAt, bookingData.endAt);
      this.bookedOutDates.push(...dateRange)

    }
 
    openConfirmModal(content) {
     this.errors = []
      this.modalRef = this.modalService.open(content);
    }

    createBooking() {
      this.newBooking.rental = this.rental;
      this.bookingService.createBooking(this.newBooking).subscribe(
        (bookingData: any) => {
          this.addNewBookedDates(bookingData);
          this.newBooking = new Booking();
          this.modalRef.close();
          this.toastr.success('Booking has been successfully created, check your booking detail in manage section', 'Success')
        },
        (errorResponse: any) => {
          this.errors = errorResponse.error.errors;
        })
    }


     selectedDate(value: any, datepicker?: any) {
        this.newBooking.startAt = this.helper.formatBookingDate(value.start);
        this.newBooking.endAt = this.helper.formatBookingDate(value.end);
        this.newBooking.days = -(value.start.diff(value.end, 'days'))
        this.newBooking.totalPrice = this.newBooking.days * this.rental.dailyRate;
    
    }
}

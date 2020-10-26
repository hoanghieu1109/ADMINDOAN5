import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent extends BaseComponent implements OnInit {

  public sachs: any;
  public sach: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  allloai:any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tenSach': [''],
      'giaBan': [''],     
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/sach/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.sachs = res.data;
      
      this.totalRecords =  res.totalSachs;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/sach/search',{page: this.page, pageSize: this.pageSize, ten: this.formsearch.get('tenSach').value, gia: this.formsearch.get('giaBan').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.sachs = res.data;
      console.log(this.sachs);
      this.totalRecords =  res.totalSachs;
      this.pageSize = res.pageSize;
      });
  }

  // pwdCheckValidator(control){
  //   var filteredStrings = {search:control.value, select:'@#!$%&*'}
  //   var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
  //   if(control.value.length < 6 || !result){
  //       return {matkhau: true};
  //   }
  // }

  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
     if (this.formdata.invalid) {
       return;
     } 
    if(this.isCreate) { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          AnhBia:data_image,
           TenSach:value.TenSach,
           MaChuDe:value.MaChuDe,
           MaNXB:value.MaNXB,
           MoTa:value.MoTa,
           SoLuongTon:value.SoLuongTon,
           GiaBan: +value.GiaBan,           
          };
          console.log(tmp);
        this._api.post('/api/Sach/create-sach',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          debugger;
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          AnhBia:data_image,
          TenSach:value.TenSach,
          MaChuDe:value.MaChuDe,
          MaNXB:value.MaNXB,
          MoTa:value.MoTa,
          GiaBan: +value.GiaBan,
          SoLuongTon:value.SoLuongTon,
          MaSach:this.sach.MaSach,             
          };
        this._api.post('/api/sach/update-sach',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 
  onDelete(row) { 
    this._api.post('/api/sach/delete-sach',{MaSach:row.MaSach}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.sach = null;
    this.formdata = this.fb.group({
      'TenSach': ['', Validators.required],
      'MoTa': ['', Validators.required],
      'MaChuDe': ['',Validators.required,],
      'MaNXB': ['', Validators.required],
      'GiaBan': ['', [Validators.required]],
      'SoLuongTon': ['', Validators.required],
    }); 
  }
  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.sach = null;
    setTimeout(() => {
      $('#createsachModal').modal('toggle');
      this.formdata = this.fb.group({
        'TenSach': ['',Validators.required],
        'MoTa': ['',Validators.required],
        'MaChuDe': ['',Validators.required],
        'MaNXB': ['', Validators.required],
        'GiaBan': ['', Validators.required],
        'SoLuongTon': ['', Validators.required],
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createsachModal').modal('toggle');
      this._api.get('/api/sach/get-by-id/'+ row.MaSach).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.sach = res; 
          this.formdata = this.fb.group({
            'MaSach': [this.sach.MaSach, Validators.required],
            'TenSach': [this.sach.TenSach, Validators.required],
            'GiaBan': [this.sach.GiaBan, Validators.required],
            'MoTa': [this.sach.MoTa, Validators.required],
            'MaChuDe': [this.sach.MaChuDe, Validators.required],
            'MaNXB': [this.sach.MaNXB, Validators.required],
            'SoLuongTon': [this.sach.SoLuongTon, Validators.required],
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }
  closeModal() {
    $('#createsachModal').closest('.modal').modal('hide');
  }
}

import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-nxb',
  templateUrl: './nxb.component.html',
  styleUrls: ['./nxb.component.css']
})
export class NxbComponent extends BaseComponent implements OnInit {

  public nxbs: any;
  public nxb: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tennxb': [''], 
    });
   
   this.search();
  }

  

  loadPage(page) { 
    this._api.post('/api/nhaxuatban/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.nxbs = res.data;
      this.totalRecords =  res.totalSachs;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/nhaxuatban/search',{page: this.page, pageSize: this.pageSize, tennxb: this.formsearch.get('tennxb').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.nxbs = res.data;
      this.totalRecords =  res.totalSachs;
      this.pageSize = res.pageSize;
      });
  }


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
          
           tennxb:value.tennxb,
           diachi:value.diachi,
           dienthoai:value.dienthoai,        
          };
          
        this._api.post('/api/nhaxuatban/create-nxb',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          debugger;
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        
        let tmp = {
          tennxb:value.tennxb,
          diachi:value.diachi,
          dienthoai:value.dienthoai,
          manxb:this.nxb.manxb,             
          };
        this._api.post('/api/nhaxuatban/update-nxb',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 
  onDelete(row) { 
    this._api.post('/api/nhaxuatban/delete-nxb',{manxb:row.manxb}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.nxb = null;
    this.formdata = this.fb.group({
      'tennxb': ['', Validators.required],
      'diachi': ['', Validators.required],
      'dienthoai': ['', Validators.required],
    }); 
  }
  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.nxb = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'tennxb': ['',Validators.required],
        'diachi': ['',Validators.required],
        'dienthoai': ['',Validators.required],
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/nhaxuatban/get-by-id/'+ row.manxb).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.nxb = res; 
          this.formdata = this.fb.group({
            'tennxb': [this.nxb.tennxb, Validators.required],
            'diachi': [this.nxb.diachi, Validators.required],
            'dienthoai': [this.nxb.dienthoai, Validators.required],
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }
  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}

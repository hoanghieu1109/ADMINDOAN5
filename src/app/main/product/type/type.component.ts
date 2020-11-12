import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent extends BaseComponent implements OnInit {
  public chudes: any;
  public chude: any;
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
      'tenchude': [''], 
    });
   
   this.search();
  }

  

  loadPage(page) { 
    this._api.post('/api/chude/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.chudes = res.data;
      this.totalRecords =  res.totalSachs;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/chude/search',{page: this.page, pageSize: this.pageSize, tenchude: this.formsearch.get('tenchude').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.chudes = res.data;
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
          
           tenchude:value.tenchude,        
          };
          
        this._api.post('/api/chude/create-chude',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          debugger;
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        
        let tmp = {
          tenchude:value.tenchude,
          machude:this.chude.machude,             
          };
        this._api.post('/api/chude/update-chude',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 
  onDelete(row) { 
    this._api.post('/api/chude/delete-chude',{machude:row.machude}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.chude = null;
    this.formdata = this.fb.group({
      'tenchude': ['', Validators.required],
    }); 
  }
  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.chude = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'tenchude': ['',Validators.required],
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
      this._api.get('/api/chude/get-by-id/'+ row.machude).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.chude = res; 
          this.formdata = this.fb.group({
            'tenchude': [this.chude.tenchude, Validators.required],
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }
  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
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
  nxbs:any;
  chudes:any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tensach': [''],
      'giaban': [''],     
    });
   
   this.search();
   this.allnxb();
   this.allchude();
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
    this._api.post('/api/sach/search',{page: this.page, pageSize: this.pageSize, tensach: this.formsearch.get('tensach').value, giaban: this.formsearch.get('giaban').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.sachs = res.data;
      console.log(this.sachs);
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
           anhbia:data_image,
           tensach:value.tensach,
           machude:Number.parseInt(value.machude),
           manxb:Number.parseInt(value.manxb), 
           mota:value.mota,
           soluongton:Number.parseInt(value.soluongton),
           giaban: +value.giaban,           
          };
        
        this._api.post('/api/sach/create-sach',tmp).takeUntil(this.unsubscribe).subscribe(res => {
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
          anhbia:data_image,
          tensach:value.tensach,
          machude:Number.parseInt(value.machude),
          manxb:Number.parseInt(value.manxb),
          mota:value.mota,
          giaban: +value.giaban,
          soluongton:Number.parseInt(value.soluongton),
          masach:this.sach.masach,             
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
    this._api.post('/api/sach/delete-sach',{masach:row.masach}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }
allnxb(){
  this._api.get('/api/nhaxuatban/get-all').takeUntil(this.unsubscribe).subscribe(res => {
    this.nxbs=res;
  });
}
allchude(){
  this._api.get('/api/chude/get-all').takeUntil(this.unsubscribe).subscribe(res => {
    this.chudes=res;
  });}
  Reset() {  
    this.sach = null;
    this.formdata = this.fb.group({
      'tensach': ['', Validators.required],
      'mota': ['', Validators.required],
      'machude': ['',Validators.required,],
      'manxb': ['', Validators.required],
      'giaban': ['', [Validators.required]],
      'soluongton': ['', Validators.required],
    }); 
  }
  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true; 
    this.sach = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'tensach': ['',Validators.required],
        'machude': ['',Validators.required],
        'manxb': ['', Validators.required],
        'soluongton': ['', Validators.required],
        'mota': ['',Validators.required],
        'giaban': ['', Validators.required],
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
      this._api.get('/api/sach/get-by-id/'+ row.masach).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.sach = res; 
          this.formdata = this.fb.group({
            
            'tensach': [this.sach.tensach, Validators.required],
            'machude': [this.sach.machude, Validators.required],
            'manxb': [this.sach.manxb, Validators.required],
            'soluongton': [this.sach.soluongton, Validators.required],
            'mota': [this.sach.mota, Validators.required],
            'giaban': [this.sach.giaban, Validators.required],

          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }
  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}

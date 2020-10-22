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

  public QLSach: any;
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
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'hoten': [''],
      'taikhoan': [''],     
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/QLSach/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.QLSach = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/QLSach/search',{page: this.page, pageSize: this.pageSize, hoten: this.formsearch.get('hoten').value, taikhoan: this.formsearch.get('taikhoan').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.QLSach = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  pwdCheckValidator(control){
    var filteredStrings = {search:control.value, select:'@#!$%&*'}
    var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
    if(control.value.length < 6 || !result){
        return {matkhau: true};
    }
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
           anhBia:data_image,
        
           tenSach:value.tenSach,
           moTa:value.moTa,
           maChuDe:value.maChuDe,
           maNXB:value.maNXB,
                    
          };
        this._api.post('/api/QLSach/create-sach',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          anhBia:data_image,
          maSach:value.maSach,
          tenSach:value.tenSach,
          moTa:value.moTa,
          maChuDe:value.maChuDe,
          maNXB:value.maNXB,
          //  sach_id:this.sach.sach_id,          
          };
        this._api.post('/api/QLSach/update-sach',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/QLSach/delete-sach',{maSach:row.maSach}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.sach = null;
    this.formdata = this.fb.group({
      'masach': ['', Validators.required],
      'tensach': ['', Validators.required],
      'mota': ['', Validators.required],
      'anhbia': ['', Validators.required],
      'machude': ['', Validators.required],
      'manxb': ['', Validators.required],
    }, {
      validator: MustMatch('matkhau', 'nhaplaimatkhau')
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
        'hoten': ['', Validators.required],
        'ngaysinh': ['', Validators.required],
        'diachi': [''],
        'gioitinh': ['', Validators.required],
        'email': ['', [Validators.required,Validators.email]],
        'taikhoan': ['', Validators.required],
        'matkhau': ['', [this.pwdCheckValidator]],
        'nhaplaimatkhau': ['', Validators.required],
        'role': ['', Validators.required],
      }, {
        validator: MustMatch('matkhau', 'nhaplaimatkhau')
      });
      this.formdata.get('ngaysinh').setValue(this.today);
      this.formdata.get('gioitinh').setValue(this.genders[0].value); 
      this.formdata.get('role').setValue(this.roles[0].value);
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createsachModal').modal('toggle');
      this._api.get('/api/QLSach/get-by-id/'+ row.sach_id).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.sach = res; 
        let ngaysinh = new Date(this.sach.ngaysinh);
          this.formdata = this.fb.group({
            'hoten': [this.sach.hoten, Validators.required],
            'ngaysinh': [ngaysinh, Validators.required],
            'diachi': [this.sach.diachi],
            'gioitinh': [this.sach.gioitinh, Validators.required],
            'email': [this.sach.email, [Validators.required,Validators.email]],
            'taikhoan': [this.sach.taikhoan, Validators.required],
            'matkhau': [this.sach.matkhau, [this.pwdCheckValidator]],
            'nhaplaimatkhau': [this.sach.matkhau, Validators.required],
            'role': [this.sach.role, Validators.required],
          }, {
            validator: MustMatch('matkhau', 'nhaplaimatkhau')
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createsachModal').closest('.modal').modal('hide');
  }
}


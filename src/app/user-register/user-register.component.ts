import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {

  file: File;
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.prepareUserForm();
  }

  /**
   * initialize user form
   */
  prepareUserForm(){
    this.userForm = this.fb.group({
      image: [''],
      full_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z\\s]+$')]],
      gender: ['', Validators.required],
      status: ['', Validators.required],
      designation: [''],
      experiences: this.fb.array([this.fb.control('')])
    })
  }

  get form(){ return this.userForm.controls; }

  get experiences() {
    return this.userForm.get('experiences') as FormArray;
  }

  /**
   * add to form array
   */
  addExperience() { this.experiences.push(this.fb.control('')); }

  /**
   * remove from form array
   */
  removeExperience(index){
    if(this.experiences.length > 1){
      this.experiences.removeAt(index);
    }
  }

  /**
   * create user
   */
  createUser(){
    if(this.userForm.invalid){
      return;
    }
    const formData: FormData = this.prepareFormData();
    this.userService.createUser(formData).subscribe(response => {
      if(response.status){
        Swal.fire('Success', response.message, 'success');
        this.userForm.reset();
        this.userForm.markAsUntouched();
      }else{
        Swal.fire('Sorry', response.message, 'error');
      }
    }, (error) => {
      Swal.fire('Sorry', error.error.message, 'error');
    });
  }

  /**
   * handle file event
   */
  handleFile(event: any){
    const fileList: FileList = event.target.files;
    if(fileList.length > 0){
      this.file = fileList[0];
      this.userForm.controls['image'].setValue(this.file.name);
    }
  }

  /**
   *prepare FormData
   */
  prepareFormData() {
    const formData = new FormData();
    if(this.file){
      formData.append('image', this.file, this.file.name);
    }
    formData.append('full_name', this.userForm.value.full_name)
    formData.append('status', this.userForm.value.status);
    formData.append('designation', this.userForm.value.designation);
    formData.append('gender', this.userForm.value.gender);
    formData.append('experiences', this.userForm.value.experiences);
    return formData;
  }


}

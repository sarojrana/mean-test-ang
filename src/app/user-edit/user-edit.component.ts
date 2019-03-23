import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  file: File;
  userId: any;
  user: any;
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.prepareUserForm();
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      this.getUserDetail();
    })
  }

  /**
   * get user detail
   */
  getUserDetail(){
    this.userService.getUserDetail(this.userId).subscribe(response => {
      if(response.status){
        this.user = response.data;
        this.setUserValue(this.user);
      }
    }, (error) => {
      Swal.fire('Sorry', error.error.message, 'error');
      this.router.navigate(['/user-list']);
    });
  }

  /**
   * set value to edit form
   * @param user
   */
  setUserValue(user){
    this.form['image'].setValue(user.image);
    this.form['full_name'].setValue(user.full_name);
    this.form['status'].setValue(user.status);
    this.form['designation'].setValue(user.designation);
    this.form['gender'].setValue(user.gender);
    (user.experiences).forEach((exp) => {
      this.experiences.push(this.fb.control(exp));
    });
    if(this.experiences.length < 1){
      this.experiences.push(this.fb.control(''));
    }
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
      experiences: this.fb.array([])
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
  editUser(){
    if(this.userForm.invalid){
      return;
    }
    const formData: FormData = this.prepareFormData();
    this.userService.editUser(this.userId, formData).subscribe(response => {
      if(response.status){
        Swal.fire('Success', response.message, 'success');
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

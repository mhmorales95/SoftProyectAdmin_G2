import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursosService } from 'src/app/_services/cursos.service';
import { NgbTab, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss']
})
export class CursoComponent implements OnInit {

    id: any;
    loading: boolean;
    curso: any;
    users: any = [];
    fileToUpload: File = null;
    carga: any;
    @ViewChild('infoImportModal') modalRef: TemplateRef<any>;
    stats : any = {
        students: 0,
        teachers: 1,
        supports: 0
    };



    constructor(
        private route: ActivatedRoute,
        private cursoService: CursosService,
        private modalService: NgbModal,
        private toastr: ToastrService,
    ) {
        this.loading = true;
        this.id = this.route.snapshot.params['id'];
        this.cursoService.get(this.id).subscribe((data:any) => {
            this.curso = data;
            this.cursoService.usersList(this.id).subscribe((userData:any) => {
                this.stats.students = userData.length;
                this.users.push(this.curso.user);
                this.users = this.users.concat(userData);
                this.loading = false;
            })
        });
    }

    loadData(){
        this.loading = true;
        this.users = [];
        this.cursoService.usersList(this.id).subscribe((userData:any) => {
            this.stats.students = userData.length;
            this.users.push(this.curso.user);
            this.users = this.users.concat(userData);
            this.loading = false;
        })
    }

    handleFileInput(files: FileList, modal) {
        this.fileToUpload = files.item(0);
        this.cursoService.uploadFile(this.fileToUpload, this.id).subscribe((data:any) => {
            this.fileToUpload = null;
            if(!data.success){
                this.toastr.error(data.msg, 'Notificación de error', { timeOut: 3000 });
                return;
            }
            this.toastr.success(data.msg, 'Notificación de exito', { timeOut: 3000 });
            this.carga = data;
            this.modalService.open(this.modalRef, {backdropClass: 'light-blue-backdrop'});
            this.loadData();
        });
    }

    ngOnInit(): void {
    }

}
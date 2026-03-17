import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttributeService } from '../../core/services/attribute.service';
import { GlobalAttribute } from '../../core/models/attribute.model';

@Component({
  selector: 'app-attributes-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './attributes-manage.component.html',
  styleUrl: './attributes-manage.component.css'
})
export class AttributesManageComponent implements OnInit {
  private attributeService = inject(AttributeService);
  private fb = inject(FormBuilder);

  attributes = signal<GlobalAttribute[]>([]);
  isEditing = signal(false);
  currentAttributeId = signal<string | null>(null);
  
  attributeForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    options: ['', Validators.required] // we store the flat string here for the input
  });

  ngOnInit() {
    this.attributeService.getAttributes().subscribe((data: GlobalAttribute[]) => {
      this.attributes.set(data);
    });
  }

  onSubmit() {
    if (this.attributeForm.invalid) {
      this.attributeForm.markAllAsTouched();
      return;
    }

    const rawData = this.attributeForm.value;
    // Convierte el string separado por comas en array limpiado
    const optionsArray = rawData.options
      .split(',')
      .map((opt: string) => opt.trim())
      .filter((opt: string) => opt.length > 0);

    const attributeData: Omit<GlobalAttribute, 'id'> = {
      name: rawData.name,
      options: optionsArray
    };

    const id = this.currentAttributeId();

    if (this.isEditing() && id) {
      this.attributeService.updateAttribute(id, attributeData).then(() => {
        this.resetForm();
      });
    } else {
      this.attributeService.addAttribute(attributeData).then(() => {
        this.resetForm();
      });
    }
  }

  editAttribute(attribute: GlobalAttribute) {
    this.isEditing.set(true);
    this.currentAttributeId.set(attribute.id);
    this.attributeForm.patchValue({
      name: attribute.name,
      options: attribute.options.join(', ')
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteAttribute(id: string) {
    if(confirm('¿Seguro que quieres eliminar este atributo global? Los productos que lo utilicen no perderán sus opciones registradas.')) {
      this.attributeService.deleteAttribute(id);
    }
  }

  resetForm() {
    this.isEditing.set(false);
    this.currentAttributeId.set(null);
    this.attributeForm.reset();
  }
}

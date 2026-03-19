import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttributeService } from '../../core/services/attribute.service';
import { GlobalAttribute, AttributeType } from '../../core/models/attribute.model';

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
  loading = signal(true);
  isEditing = signal(false);
  isModalOpen = signal(false);
  currentAttributeId = signal<string | null>(null);

  attributeForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    type: ['text', Validators.required],
    options: ['', Validators.required]
  });

  ngOnInit() {
    this.attributeService.getAttributes().subscribe((data: GlobalAttribute[]) => {
      this.attributes.set(data);
      this.loading.set(false);
    });
  }

  openModal(attribute?: GlobalAttribute) {
    if (attribute) {
      this.isEditing.set(true);
      this.currentAttributeId.set(attribute.id);
      this.attributeForm.patchValue({
        name: attribute.name,
        type: attribute.type ?? 'text',
        options: attribute.options.join(', ')
      });
    } else {
      this.isEditing.set(false);
      this.currentAttributeId.set(null);
      this.attributeForm.reset({ type: 'text' });
    }
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen.set(false);
    document.body.style.overflow = '';
    this.resetForm();
  }

  onSubmit() {
    if (this.attributeForm.invalid) {
      this.attributeForm.markAllAsTouched();
      return;
    }

    const rawData = this.attributeForm.value;
    const optionsArray = rawData.options
      .split(',')
      .map((opt: string) => opt.trim())
      .filter((opt: string) => opt.length > 0);

    const attributeData: Omit<GlobalAttribute, 'id'> = {
      name: rawData.name,
      type: rawData.type as AttributeType,
      options: optionsArray
    };

    const id = this.currentAttributeId();

    if (this.isEditing() && id) {
      this.attributeService.updateAttribute(id, attributeData).then(() => this.closeModal());
    } else {
      this.attributeService.addAttribute(attributeData).then(() => this.closeModal());
    }
  }

  editAttribute(attribute: GlobalAttribute) {
    this.openModal(attribute);
  }

  deleteAttribute(id: string) {
    if (confirm('¿Seguro que quieres eliminar este atributo global?')) {
      this.attributeService.deleteAttribute(id);
    }
  }

  resetForm() {
    this.isEditing.set(false);
    this.currentAttributeId.set(null);
    this.attributeForm.reset({ type: 'text' });
  }
}

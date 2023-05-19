import { Component, TemplateRef } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-toast-global',
  // imports: [NgbTooltipModule, ToastsContainer],
  templateUrl: './toast-global.component.html',
  styleUrls: ['./toast-global.component.scss']
})
export class ToastGlobalComponent {
  constructor(public toastService: ToastService) {}

  showStandard() {
		this.toastService.show('I am a standard toast');
	}

	showSuccess() {
		this.toastService.show('I am a success toast', { classname: 'bg-success text-light', delay: 10000 });
	}

	showDanger(dangerTpl: string | TemplateRef<any>) {
		this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 15000 });
	}

	ngOnDestroy(): void {
		this.toastService.clear();
	}
}

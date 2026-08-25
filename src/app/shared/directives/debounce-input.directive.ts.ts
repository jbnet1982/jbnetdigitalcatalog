import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appDebounce]',
  standalone: true
})
export class DebounceInputDirective implements OnInit, OnDestroy {
  @Input() appDebounce: number = 300;
  @Output() debounceChange = new EventEmitter<string>();

  private input$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.input$.pipe(
      debounceTime(this.appDebounce),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.debounceChange.emit(value);
    });

    this.elementRef.nativeElement.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.input$.next(target.value);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

export default [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()];

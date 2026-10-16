import { Injectable } from '@angular/core';
import { Converter, Occ, Product } from '@spartacus/core';

// Phase 4, Step 10.
// 1. TYPE: "module augmentation" adds a field to the storefront's Product interface
declare module '@spartacus/core' {
  interface Product {
    warrantyYears?: number;
  }
}

// 2. CONVERT: the normalizer receives the OCC response (source)
//    and the product already converted by the default normalizers (target)
@Injectable({ providedIn: 'root' })
export class WarrantyNormalizer implements Converter<Occ.Product, Product> {
  convert(source: Occ.Product, target?: Product): Product {
    const result = target ?? ({ ...source } as Product); // uses the target if present
    result.warrantyYears = (source as any).warrantyYears; // copies the new field
    return result;
  }
}

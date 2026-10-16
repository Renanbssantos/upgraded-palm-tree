import { Occ, Product } from '@spartacus/core';
import { WarrantyNormalizer } from './warranty.normalizer';

describe('WarrantyNormalizer', () => {
  const normalizer = new WarrantyNormalizer();

  it('copies warrantyYears onto the product built by the default normalizers', () => {
    const source = { code: '1', warrantyYears: 2 } as Occ.Product;
    const target: Product = { code: '1', name: 'already converted' };

    const result = normalizer.convert(source, target);

    expect(result).toBe(target); // keeps the work of the normalizers before it
    expect(result.warrantyYears).toBe(2);
    expect(result.name).toBe('already converted');
  });

  it('leaves the field undefined when the OCC does not send it', () => {
    expect(normalizer.convert({ code: '1' } as Occ.Product).warrantyYears).toBeUndefined();
  });
});

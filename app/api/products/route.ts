import { NextResponse } from 'next/server';
import { createServerSupabaseClient, isSupabaseConfigured } from '@/utils/supabase-server';
import { states } from '@/app/data/shopData';

function deriveMetadataFromName(product: any) {
  const defaultFlag = states.find((s) => s.code === 'AL')?.flag || '';
  const defaultLogo = '/assets/images/logo-dark-bg.png';
  const defaultYear = 2025;

  const genericMetadata = {
    state: 'General',
    code: '',
    program: 'General',
    productLabel: product.name || '',
    bestValue: false,
    tags: [],
    format: 'PDF Format',
    download: true,
    flag: defaultFlag,
    logo: defaultLogo,
    year: defaultYear,
  };

  if (!product.name) {
    return genericMetadata;
  }

  const generalProducts: Record<string, any> = {
    'Market Research Report': {
      code: 'MR',
      program: 'Market Research',
      productLabel: 'Market Research Report',
      tags: ['Market Research'],
    },
    'Policy & Procedure Manual': {
      code: 'PM',
      program: 'Policies',
      productLabel: 'Policy & Procedure Manual',
      tags: ['Policy & Procedure'],
    },
    'Pro Forma P&L Template': {
      code: 'PL',
      program: 'Financial',
      productLabel: 'Pro Forma P&L Template',
      tags: ['Financial Template'],
      format: 'Excel Format',
    },
    'Licensing Checklist': {
      code: 'LC',
      program: 'Checklist',
      productLabel: 'Licensing Checklist',
      tags: ['Licensing Checklist'],
    },
  };

  if (generalProducts[product.name]) {
    return {
      ...genericMetadata,
      ...generalProducts[product.name],
      state: 'General',
      flag: defaultFlag,
      logo: defaultLogo,
    };
  }

  const bundleMatch = product.name.match(/^(.*?) (.+?) Complete Bundle$/);
  if (bundleMatch) {
    const stateName = bundleMatch[1];
    const program = bundleMatch[2];
    const state = states.find((s) => s.name === stateName);
    return {
      ...genericMetadata,
      state: stateName,
      code: state?.code || '',
      program,
      productLabel: 'Complete Bundle',
      tags: [stateName, program],
      flag: state?.flag || defaultFlag,
      logo: defaultLogo,
    };
  }

  return genericMetadata;
}

function parseJsonField(value: any) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }
  return value;
}

async function fetchProductsWithMetadata(supabase: any) {
  const selectFields = '*';

  const { data, error } = await supabase
    .from('products')
    .select(selectFields)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  const products = (data || []).map((product: any) => {
    const metadata = parseJsonField(product.metadata);
    const features = parseJsonField(product.features);
    const normalizedMetadata = metadata && typeof metadata === 'object' ? metadata : undefined;
    const explicitTags = parseJsonField(product.tags);
    const explicitMetadata: any = {
      state: product.state || normalizedMetadata?.state,
      code: product.code || normalizedMetadata?.code,
      program: product.program || normalizedMetadata?.program,
      productLabel: product.product_label || normalizedMetadata?.productLabel,
      tags: Array.isArray(explicitTags)
        ? explicitTags
        : normalizedMetadata?.tags || [],
    };
    const normalizedFeatures = Array.isArray(features) ? features : [];
    const derivedMetadata = deriveMetadataFromName(product);
    const mergedMetadata = normalizedMetadata
      ? { ...derivedMetadata, ...normalizedMetadata, ...explicitMetadata }
      : { ...derivedMetadata, ...explicitMetadata };

    return {
      ...product,
      metadata: mergedMetadata,
      features: normalizedFeatures,
    };
  });

  return { data: products, error: null };
}

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const supabase = createServerSupabaseClient();

  let result = await fetchProductsWithMetadata(supabase);

  if (result.error) {
    return NextResponse.json(
      { error: result.error.message || 'Unable to load products from database' },
      { status: 500 },
    );
  }

  return NextResponse.json({ products: result.data || [] });
}

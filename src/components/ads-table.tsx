'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Badge, Table, td, th } from '@/components/ui';
import { buildUtmUrl } from '@/lib/domain/utm';
import { number, rupiah, rupiahShort } from '@/lib/format';
import { AD_STATUS, PLATFORM } from '@/lib/labels';
import type { AdPlan } from '@/lib/types';

const LANDING = 'https://batikorganik.example/produk';

function CopyUtm({ ad }: { ad: AdPlan }) {
  const [copied, setCopied] = useState(false);
  const result = buildUtmUrl(LANDING, ad.utm);
  if (!result.ok) return <span className="text-danger-text">{result.error}</span>;
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(result.url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          window.prompt('Salin URL ini:', result.url);
        }
      }}
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-body-sm text-link hover:bg-accent"
      title={result.url}
    >
      {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      {copied ? 'Tersalin' : 'Salin URL'}
    </button>
  );
}

export function AdsTable({ ads, showCampaign, campaignName }: { ads: AdPlan[]; showCampaign?: boolean; campaignName?: (id: string) => string }) {
  return (
    <Table label="Ads plan">
      <thead>
        <tr>
          <th className={th}>Ad</th>
          {showCampaign ? <th className={th}>Campaign</th> : null}
          <th className={th}>Objective dan tujuan</th>
          <th className={th}>Budget/hari</th>
          <th className={th}>Spend · Leads · CPL</th>
          <th className={th}>UTM</th>
          <th className={th}>Status</th>
        </tr>
      </thead>
      <tbody>
        {ads.map((ad) => (
          <tr key={ad.id}>
            <td className={td}>
              <p className="font-semibold">{ad.name}</p>
              <p className="text-body-sm text-muted-foreground">
                {PLATFORM[ad.platform]} · {ad.market} · {ad.audience}
              </p>
            </td>
            {showCampaign ? <td className={td}>{campaignName?.(ad.campaignId)}</td> : null}
            <td className={td}>
              <p>{ad.objective}</p>
              <p className="text-body-sm text-muted-foreground">{ad.destination}</p>
            </td>
            <td className={`${td} tabular`}>{ad.dailyBudget > 0 ? rupiah(ad.dailyBudget) : 'Tanpa spend'}</td>
            <td className={`${td} tabular`}>
              {ad.spend > 0 ? (
                <>
                  {rupiahShort(ad.spend)} · {number(ad.leads)} · {ad.leads > 0 ? rupiahShort(Math.round(ad.spend / ad.leads)) : 'belum ada'}
                </>
              ) : (
                <span className="text-muted-foreground">Belum tayang</span>
              )}
            </td>
            <td className={td}>
              <p className="font-mono text-mono text-muted-foreground">{ad.utm.campaign}</p>
              <CopyUtm ad={ad} />
            </td>
            <td className={td}>
              <Badge tone={AD_STATUS[ad.status].tone}>{AD_STATUS[ad.status].label}</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

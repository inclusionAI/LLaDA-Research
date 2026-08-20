# Homepage Column Hierarchy Correction

## Goal

Make the Models, Papers, and Blog column headings unmistakably more prominent than their lead content titles.

## Design

- Column headings use a 36–40px fluid size, weight 500, and primary ink.
- Lead entry titles use a 21–23px fluid size, weight 520.
- Compact entry titles remain 16–18px.
- At desktop widths, the computed column-heading size must be at least 1.5 times the lead-title size.
- Column descriptions remain 15px supporting text.
- Increase space below the column header and add a subtle divider before the entries so the section identity and content list read as separate layers.
- On mobile, preserve the same semantic ordering without forcing the desktop ratio; headings remain clearly larger than lead titles.

## Scope

Only homepage research columns and their hierarchy test change. Content, recommendation selection, archive typography, and detail-page typography remain unchanged.

## Verification

- Assert desktop heading-to-lead ratio is at least 1.5.
- Assert heading weight does not exceed lead-title weight.
- Assert the divider is visible and spacing remains consistent.
- Verify desktop, 901px, and mobile layouts without clipping or overflow.

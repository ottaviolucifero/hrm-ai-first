-- Source: DataHub core/country-codes (ODC-PDDL-1.0)
-- URL: https://datahub.io/core/country-codes
-- Dial field reduced to primary/base E.164 country code per ISO alpha-2
UPDATE countries
SET phone_code = CASE iso_code
    WHEN 'AD' THEN '+376'
    WHEN 'AE' THEN '+971'
    WHEN 'AF' THEN '+93'
    WHEN 'AG' THEN '+1'
    WHEN 'AI' THEN '+1'
    WHEN 'AL' THEN '+355'
    WHEN 'AM' THEN '+374'
    WHEN 'AO' THEN '+244'
    WHEN 'AQ' THEN '+672'
    WHEN 'AR' THEN '+54'
    WHEN 'AS' THEN '+1'
    WHEN 'AT' THEN '+43'
    WHEN 'AU' THEN '+61'
    WHEN 'AW' THEN '+297'
    WHEN 'AX' THEN '+358'
    WHEN 'AZ' THEN '+994'
    WHEN 'BA' THEN '+387'
    WHEN 'BB' THEN '+1'
    WHEN 'BD' THEN '+880'
    WHEN 'BE' THEN '+32'
    WHEN 'BF' THEN '+226'
    WHEN 'BG' THEN '+359'
    WHEN 'BH' THEN '+973'
    WHEN 'BI' THEN '+257'
    WHEN 'BJ' THEN '+229'
    WHEN 'BL' THEN '+590'
    WHEN 'BM' THEN '+1'
    WHEN 'BN' THEN '+673'
    WHEN 'BO' THEN '+591'
    WHEN 'BQ' THEN '+599'
    WHEN 'BR' THEN '+55'
    WHEN 'BS' THEN '+1'
    WHEN 'BT' THEN '+975'
    WHEN 'BV' THEN '+47'
    WHEN 'BW' THEN '+267'
    WHEN 'BY' THEN '+375'
    WHEN 'BZ' THEN '+501'
    WHEN 'CA' THEN '+1'
    WHEN 'CC' THEN '+61'
    WHEN 'CD' THEN '+243'
    WHEN 'CF' THEN '+236'
    WHEN 'CG' THEN '+242'
    WHEN 'CH' THEN '+41'
    WHEN 'CI' THEN '+225'
    WHEN 'CK' THEN '+682'
    WHEN 'CL' THEN '+56'
    WHEN 'CM' THEN '+237'
    WHEN 'CN' THEN '+86'
    WHEN 'CO' THEN '+57'
    WHEN 'CR' THEN '+506'
    WHEN 'CU' THEN '+53'
    WHEN 'CV' THEN '+238'
    WHEN 'CW' THEN '+599'
    WHEN 'CX' THEN '+61'
    WHEN 'CY' THEN '+357'
    WHEN 'CZ' THEN '+420'
    WHEN 'DE' THEN '+49'
    WHEN 'DJ' THEN '+253'
    WHEN 'DK' THEN '+45'
    WHEN 'DM' THEN '+1'
    WHEN 'DO' THEN '+1'
    WHEN 'DZ' THEN '+213'
    WHEN 'EC' THEN '+593'
    WHEN 'EE' THEN '+372'
    WHEN 'EG' THEN '+20'
    WHEN 'EH' THEN '+212'
    WHEN 'ER' THEN '+291'
    WHEN 'ES' THEN '+34'
    WHEN 'ET' THEN '+251'
    WHEN 'FI' THEN '+358'
    WHEN 'FJ' THEN '+679'
    WHEN 'FK' THEN '+500'
    WHEN 'FM' THEN '+691'
    WHEN 'FO' THEN '+298'
    WHEN 'FR' THEN '+33'
    WHEN 'GA' THEN '+241'
    WHEN 'GB' THEN '+44'
    WHEN 'GD' THEN '+1'
    WHEN 'GE' THEN '+995'
    WHEN 'GF' THEN '+594'
    WHEN 'GG' THEN '+44'
    WHEN 'GH' THEN '+233'
    WHEN 'GI' THEN '+350'
    WHEN 'GL' THEN '+299'
    WHEN 'GM' THEN '+220'
    WHEN 'GN' THEN '+224'
    WHEN 'GP' THEN '+590'
    WHEN 'GQ' THEN '+240'
    WHEN 'GR' THEN '+30'
    WHEN 'GS' THEN '+500'
    WHEN 'GT' THEN '+502'
    WHEN 'GU' THEN '+1'
    WHEN 'GW' THEN '+245'
    WHEN 'GY' THEN '+592'
    WHEN 'HK' THEN '+852'
    WHEN 'HM' THEN '+672'
    WHEN 'HN' THEN '+504'
    WHEN 'HR' THEN '+385'
    WHEN 'HT' THEN '+509'
    WHEN 'HU' THEN '+36'
    WHEN 'ID' THEN '+62'
    WHEN 'IE' THEN '+353'
    WHEN 'IL' THEN '+972'
    WHEN 'IM' THEN '+44'
    WHEN 'IN' THEN '+91'
    WHEN 'IO' THEN '+246'
    WHEN 'IQ' THEN '+964'
    WHEN 'IR' THEN '+98'
    WHEN 'IS' THEN '+354'
    WHEN 'IT' THEN '+39'
    WHEN 'JE' THEN '+44'
    WHEN 'JM' THEN '+1'
    WHEN 'JO' THEN '+962'
    WHEN 'JP' THEN '+81'
    WHEN 'KE' THEN '+254'
    WHEN 'KG' THEN '+996'
    WHEN 'KH' THEN '+855'
    WHEN 'KI' THEN '+686'
    WHEN 'KM' THEN '+269'
    WHEN 'KN' THEN '+1'
    WHEN 'KP' THEN '+850'
    WHEN 'KR' THEN '+82'
    WHEN 'KW' THEN '+965'
    WHEN 'KY' THEN '+1'
    WHEN 'KZ' THEN '+7'
    WHEN 'LA' THEN '+856'
    WHEN 'LB' THEN '+961'
    WHEN 'LC' THEN '+1'
    WHEN 'LI' THEN '+423'
    WHEN 'LK' THEN '+94'
    WHEN 'LR' THEN '+231'
    WHEN 'LS' THEN '+266'
    WHEN 'LT' THEN '+370'
    WHEN 'LU' THEN '+352'
    WHEN 'LV' THEN '+371'
    WHEN 'LY' THEN '+218'
    WHEN 'MA' THEN '+212'
    WHEN 'MC' THEN '+377'
    WHEN 'MD' THEN '+373'
    WHEN 'ME' THEN '+382'
    WHEN 'MF' THEN '+590'
    WHEN 'MG' THEN '+261'
    WHEN 'MH' THEN '+692'
    WHEN 'MK' THEN '+389'
    WHEN 'ML' THEN '+223'
    WHEN 'MM' THEN '+95'
    WHEN 'MN' THEN '+976'
    WHEN 'MO' THEN '+853'
    WHEN 'MP' THEN '+1'
    WHEN 'MQ' THEN '+596'
    WHEN 'MR' THEN '+222'
    WHEN 'MS' THEN '+1'
    WHEN 'MT' THEN '+356'
    WHEN 'MU' THEN '+230'
    WHEN 'MV' THEN '+960'
    WHEN 'MW' THEN '+265'
    WHEN 'MX' THEN '+52'
    WHEN 'MY' THEN '+60'
    WHEN 'MZ' THEN '+258'
    WHEN 'NA' THEN '+264'
    WHEN 'NC' THEN '+687'
    WHEN 'NE' THEN '+227'
    WHEN 'NF' THEN '+672'
    WHEN 'NG' THEN '+234'
    WHEN 'NI' THEN '+505'
    WHEN 'NL' THEN '+31'
    WHEN 'NO' THEN '+47'
    WHEN 'NP' THEN '+977'
    WHEN 'NR' THEN '+674'
    WHEN 'NU' THEN '+683'
    WHEN 'NZ' THEN '+64'
    WHEN 'OM' THEN '+968'
    WHEN 'PA' THEN '+507'
    WHEN 'PE' THEN '+51'
    WHEN 'PF' THEN '+689'
    WHEN 'PG' THEN '+675'
    WHEN 'PH' THEN '+63'
    WHEN 'PK' THEN '+92'
    WHEN 'PL' THEN '+48'
    WHEN 'PM' THEN '+508'
    WHEN 'PN' THEN '+870'
    WHEN 'PR' THEN '+1'
    WHEN 'PS' THEN '+970'
    WHEN 'PT' THEN '+351'
    WHEN 'PW' THEN '+680'
    WHEN 'PY' THEN '+595'
    WHEN 'QA' THEN '+974'
    WHEN 'RE' THEN '+262'
    WHEN 'RO' THEN '+40'
    WHEN 'RS' THEN '+381'
    WHEN 'RU' THEN '+7'
    WHEN 'RW' THEN '+250'
    WHEN 'SA' THEN '+966'
    WHEN 'SB' THEN '+677'
    WHEN 'SC' THEN '+248'
    WHEN 'SD' THEN '+249'
    WHEN 'SE' THEN '+46'
    WHEN 'SG' THEN '+65'
    WHEN 'SH' THEN '+290'
    WHEN 'SI' THEN '+386'
    WHEN 'SJ' THEN '+47'
    WHEN 'SK' THEN '+421'
    WHEN 'SL' THEN '+232'
    WHEN 'SM' THEN '+378'
    WHEN 'SN' THEN '+221'
    WHEN 'SO' THEN '+252'
    WHEN 'SR' THEN '+597'
    WHEN 'SS' THEN '+211'
    WHEN 'ST' THEN '+239'
    WHEN 'SV' THEN '+503'
    WHEN 'SX' THEN '+1'
    WHEN 'SY' THEN '+963'
    WHEN 'SZ' THEN '+268'
    WHEN 'TC' THEN '+1'
    WHEN 'TD' THEN '+235'
    WHEN 'TF' THEN '+262'
    WHEN 'TG' THEN '+228'
    WHEN 'TH' THEN '+66'
    WHEN 'TJ' THEN '+992'
    WHEN 'TK' THEN '+690'
    WHEN 'TL' THEN '+670'
    WHEN 'TM' THEN '+993'
    WHEN 'TN' THEN '+216'
    WHEN 'TO' THEN '+676'
    WHEN 'TR' THEN '+90'
    WHEN 'TT' THEN '+1'
    WHEN 'TV' THEN '+688'
    WHEN 'TW' THEN '+886'
    WHEN 'TZ' THEN '+255'
    WHEN 'UA' THEN '+380'
    WHEN 'UG' THEN '+256'
    WHEN 'US' THEN '+1'
    WHEN 'UY' THEN '+598'
    WHEN 'UZ' THEN '+998'
    WHEN 'VA' THEN '+39'
    WHEN 'VC' THEN '+1'
    WHEN 'VE' THEN '+58'
    WHEN 'VG' THEN '+1'
    WHEN 'VI' THEN '+1'
    WHEN 'VN' THEN '+84'
    WHEN 'VU' THEN '+678'
    WHEN 'WF' THEN '+681'
    WHEN 'WS' THEN '+685'
    WHEN 'YE' THEN '+967'
    WHEN 'YT' THEN '+262'
    WHEN 'ZA' THEN '+27'
    WHEN 'ZM' THEN '+260'
    WHEN 'ZW' THEN '+263'
    ELSE phone_code
END,
    updated_at = CURRENT_TIMESTAMP
WHERE iso_code IN (
    'AD',
    'AE',
    'AF',
    'AG',
    'AI',
    'AL',
    'AM',
    'AO',
    'AQ',
    'AR',
    'AS',
    'AT',
    'AU',
    'AW',
    'AX',
    'AZ',
    'BA',
    'BB',
    'BD',
    'BE',
    'BF',
    'BG',
    'BH',
    'BI',
    'BJ',
    'BL',
    'BM',
    'BN',
    'BO',
    'BQ',
    'BR',
    'BS',
    'BT',
    'BV',
    'BW',
    'BY',
    'BZ',
    'CA',
    'CC',
    'CD',
    'CF',
    'CG',
    'CH',
    'CI',
    'CK',
    'CL',
    'CM',
    'CN',
    'CO',
    'CR',
    'CU',
    'CV',
    'CW',
    'CX',
    'CY',
    'CZ',
    'DE',
    'DJ',
    'DK',
    'DM',
    'DO',
    'DZ',
    'EC',
    'EE',
    'EG',
    'EH',
    'ER',
    'ES',
    'ET',
    'FI',
    'FJ',
    'FK',
    'FM',
    'FO',
    'FR',
    'GA',
    'GB',
    'GD',
    'GE',
    'GF',
    'GG',
    'GH',
    'GI',
    'GL',
    'GM',
    'GN',
    'GP',
    'GQ',
    'GR',
    'GS',
    'GT',
    'GU',
    'GW',
    'GY',
    'HK',
    'HM',
    'HN',
    'HR',
    'HT',
    'HU',
    'ID',
    'IE',
    'IL',
    'IM',
    'IN',
    'IO',
    'IQ',
    'IR',
    'IS',
    'IT',
    'JE',
    'JM',
    'JO',
    'JP',
    'KE',
    'KG',
    'KH',
    'KI',
    'KM',
    'KN',
    'KP',
    'KR',
    'KW',
    'KY',
    'KZ',
    'LA',
    'LB',
    'LC',
    'LI',
    'LK',
    'LR',
    'LS',
    'LT',
    'LU',
    'LV',
    'LY',
    'MA',
    'MC',
    'MD',
    'ME',
    'MF',
    'MG',
    'MH',
    'MK',
    'ML',
    'MM',
    'MN',
    'MO',
    'MP',
    'MQ',
    'MR',
    'MS',
    'MT',
    'MU',
    'MV',
    'MW',
    'MX',
    'MY',
    'MZ',
    'NA',
    'NC',
    'NE',
    'NF',
    'NG',
    'NI',
    'NL',
    'NO',
    'NP',
    'NR',
    'NU',
    'NZ',
    'OM',
    'PA',
    'PE',
    'PF',
    'PG',
    'PH',
    'PK',
    'PL',
    'PM',
    'PN',
    'PR',
    'PS',
    'PT',
    'PW',
    'PY',
    'QA',
    'RE',
    'RO',
    'RS',
    'RU',
    'RW',
    'SA',
    'SB',
    'SC',
    'SD',
    'SE',
    'SG',
    'SH',
    'SI',
    'SJ',
    'SK',
    'SL',
    'SM',
    'SN',
    'SO',
    'SR',
    'SS',
    'ST',
    'SV',
    'SX',
    'SY',
    'SZ',
    'TC',
    'TD',
    'TF',
    'TG',
    'TH',
    'TJ',
    'TK',
    'TL',
    'TM',
    'TN',
    'TO',
    'TR',
    'TT',
    'TV',
    'TW',
    'TZ',
    'UA',
    'UG',
    'US',
    'UY',
    'UZ',
    'VA',
    'VC',
    'VE',
    'VG',
    'VI',
    'VN',
    'VU',
    'WF',
    'WS',
    'YE',
    'YT',
    'ZA',
    'ZM',
    'ZW'
);

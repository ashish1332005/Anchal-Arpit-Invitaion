with open('ref_bundle.js', 'r', encoding='utf-8') as f:
    s = f.read()

keywords = ['WEDDING_DETAILS', 'section', 'hero', 'ceremony', 'regards-love', 'music']
for kw in keywords:
    print(f'========== KEYWORD: {kw} ==========')
    idx = 0
    while True:
        pos = s.find(kw, idx)
        if pos == -1:
            break
        print(s[max(0, pos-150):min(len(s), pos+350)])
        print('-'*50)
        idx = pos + len(kw) + 200
        if idx > pos + 3000:
            break

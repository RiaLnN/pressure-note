import json
import os
import random

class I18n:
    def __init__(self):
        self.translations = {}
        self._load_translations()
    
    def _load_translations(self):
        locales_path = 'app/locales'
        for lang in ['en', 'ru', 'ua']:
            path = f"{locales_path}/{lang}.json"
            if os.path.exists(path):
                with open(path, 'r', encoding='utf-8') as f:
                    self.translations[lang] = json.load(f)

    def t(self, lang, key, **kwargs):
        keys = key.split('.')
        data = self.translations.get(lang, self.translations['en'])
        for k in keys:
            data = data.get(k, {})
            
        if isinstance(data, list):
            return random.choice(data).format(**kwargs)
        return data.format(**kwargs)

i18n = I18n()
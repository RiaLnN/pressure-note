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
        data = self.translations.get(lang, self.translations.get('en', {}))
        
        for k in keys:
            if isinstance(data, dict):
                data = data.get(k)
            else:
                data = None
                break
        
        if data is None:
            return key 

        if isinstance(data, list):
            data = random.choice(data)
            
        try:
            return data.format(**kwargs)
        except KeyError as e:
            return f"Error: Missing placeholder {e} in template"
        except AttributeError:
            return str(data)

i18n = I18n()
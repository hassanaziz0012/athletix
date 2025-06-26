from django.core.files.base import ContentFile
from django.core.files.uploadedfile import TemporaryUploadedFile
from django.core.files.storage import Storage
from django.conf import settings
import requests
import base64


class ImgurStorage(Storage):
    def __init__(self) -> None:
        self.client_id = settings.IMGUR_CLIENT_ID
        self.client_secret = settings.IMGUR_CLIENT_SECRET
        super().__init__()

    def delete(self, name: str) -> None:
        return super().delete(name)
    
    def exists(self, name: str) -> bool:
        return False
    
    def url(self, name: str) -> str:
        return name
    
    def size(self, name: str) -> int:
        return 1 # Placeholder value.
    
    def _open(self, name: str, mode: str = "rb"):
        resp = requests.get(name)
        if resp.status_code == 200:
            return ContentFile(resp.content, name)
    
    def _save(self, name: str, content: TemporaryUploadedFile):
        url = 'https://api.imgur.com/3/image'
        image_data = {
            'image': base64.b64encode(content.read())
        }
        headers = {
            'Authorization': f'Client-ID {self.client_id}'
        }
        response = requests.post(url, headers=headers, data=image_data)
        if response.status_code == 200:
            image_link = response.json()['data'].get('link')
            return image_link
        else:
            raise requests.HTTPError("Failed to save image.")

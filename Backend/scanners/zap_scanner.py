import time
import logging
from zapv2 import ZAPv2
from config import settings
from urllib.parse import urlparse, urljoin
import requests

class ZAPScanner:
    def __init__(self):
        try:
            # Test if ZAP is actually running first
            test_url = f'http://{settings.ZAP_ADDRESS}:{settings.ZAP_PORT}'
            requests.get(test_url, timeout=2)
            
            self.zap = ZAPv2(
                apikey=settings.ZAP_API_KEY,
                proxies={'http': f'http://{settings.ZAP_ADDRESS}:{settings.ZAP_PORT}'}
            )
            # Test connection
            version = self.zap.core.version
            logging.info(f"ZAP connection successful (version {version})")
        except requests.exceptions.RequestException as e:
            logging.error(f"ZAP server is not running at {settings.ZAP_ADDRESS}:{settings.ZAP_PORT}")
            raise ConnectionError(f"Cannot connect to ZAP server: {str(e)}")
        except Exception as e:
            logging.error(f"ZAP initialization failed: {str(e)}")
            raise

    async def start_scan(self, target_url: str):
        try:
            # Validate and clean URL
            parsed_url = urlparse(target_url)
            if not parsed_url.scheme:
                target_url = f"http://{target_url}"
            
            logging.info(f"Starting scan for: {target_url}")

            # Start with a clean session
            self.zap.core.new_session()
            
            # Access the target first
            self.zap.core.access_url(url=target_url)
            time.sleep(5)  # Give some time for the site to load

            # Spider the target
            logging.info("Starting Spider scan...")
            scan_id = self.zap.spider.scan(url=target_url)
            
            # Wait for Spider to complete
            while int(self.zap.spider.status(scan_id)) < 100:
                logging.info(f'Spider progress: {self.zap.spider.status(scan_id)}%')
                time.sleep(5)
            
            logging.info("Spider completed, starting active scan...")
            
            # Perform active scan
            active_scan_id = self.zap.ascan.scan(url=target_url)
            
            # Wait for active scan to complete
            while int(self.zap.ascan.status(active_scan_id)) < 100:
                logging.info(f'Active scan progress: {self.zap.ascan.status(active_scan_id)}%')
                time.sleep(5)
            
            # Get alerts
            alerts = self.zap.core.alerts()
            logging.info(f"Scan completed. Found {len(alerts)} alerts")
            
            return {
                "status": "success",
                "alerts": alerts,
                "spider_scan_id": scan_id,
                "active_scan_id": active_scan_id
            }
        except Exception as e:
            error_msg = str(e)
            logging.error(f"Scan failed: {error_msg}")
            return {
                "status": "error",
                "message": error_msg
            }

    async def get_scan_results(self, scan_id: str):
        try:
            alerts = self.zap.core.alerts()
            return {
                "status": "success",
                "alerts": alerts
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

    async def get_version(self):
        try:
            return str(self.zap.core.version)
        except Exception as e:
            return str(e)

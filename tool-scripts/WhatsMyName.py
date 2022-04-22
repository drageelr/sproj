from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options
import time
import warnings
import sys
import os 
import json

class WhatsMyName:
    def __init__(self, searchVal):
        self._searchVal = searchVal

    def search(self):
        osintResults = {}
        path = '/root/chromedriver' # '/root/chromedriver' "/home/drageelr/Tools/chromedriver_linux64/chromedriver" 
        options = Options()
        options.add_argument("--disable-web-security")
        options.add_argument('--allow-running-insecure-content')
        options.add_argument('--ignore-certificate-errors-spki-list')
        options.add_argument("test-type");
        options.add_argument("-incognito");
        options.add_argument("--ignore-ssl-errors")
        options.add_argument("--disable-site-isolation-trials")
        options.add_argument("--log-level=3")
        options.add_argument("--disable-extensions")
        options.headless = True
        driver = webdriver.Chrome(path,options=options) 
        url = 'https://whatsmyname.app/?q=' + self._searchVal
        driver.get(url)

        # Filter select
        filter = Select(driver.find_element_by_id("filters"))
        filter.select_by_value("all")


        # Search button
        search_btn = driver.find_element_by_class_name("input-group-append").find_element_by_tag_name("button")
        search_btn.click()

        # Wait for 20 seconds to allow results to be found (Tweak this as required)
        time.sleep(20)

        while True:
            try: 
                # Find results table
                resultsContainer = driver.find_element_by_id("resultsHTML")

                # Get all results
                results = resultsContainer.find_elements_by_class_name("card-link")

                # Get data from all results
                for result in results:
                    name = str(result.text)
                    link = str(result.get_attribute("href"))
                    osintResults[name.strip().lower()] = link.strip().lower()
                break
            
            except Exception:
                continue
            
        return osintResults

def main(name):
    warnings.filterwarnings("ignore")
    osint = WhatsMyName(name)
    json_object = json.dumps(osint.search(), indent=2)
    print(json_object)
    

if __name__ == "__main__":
    main(sys.argv[1])
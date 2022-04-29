from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import sys
import warnings
import json
import time

def handleIPResults(driver):
    output_obj = {}
        
    tbody = driver.find_element_by_id('dw-table').find_element_by_tag_name('tbody')
    trs = tbody.find_elements_by_tag_name('tr')

    for tr in trs:
        key = None
        val = None
        try:
            tds = tr.find_elements_by_tag_name('td')
            if (len(tds) == 2):
                key = tds[0].get_attribute('innerHTML').strip().lower()
                # print('key', key)
                value = tds[1].get_attribute('data-clipboard-text').strip().lower()
                # print('value', value)
                output_obj[key] = value
        except:
            # print('exp')
            pass

    return output_obj

attr_handler_map = {
    'ip': handleIPResults,
}

class IPAPI:
    def __init__(self, value, attr_type):
        self.value = value
        self.attr_type = attr_type
        pass
    
    def dumpJSON(self, obj):
        print(json.dumps(obj, indent=2))
    pass

    def generate_driver(self):
        options = Options()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.headless = True
        self.driver = webdriver.Chrome('/home/drageelr/Tools/chromedriver_linux64/chromedriver', options=options) # /home/drageelr/Tools/chromedriver_linux64/chromedriver '/root/chromedriver'
        self.driver.get('https://ipapi.co/')

    def place_data(self):
        try:
            WebDriverWait(self.driver, 10).until(lambda s: s.find_element_by_id('ip-qv').is_displayed())
            text_box = self.driver.find_element_by_id('ip-qv')
            text_box.send_keys(self.value)
        except Exception as e:
            return False
        return True

    def start(self):
        # try:
        #     pass
        # except:
        #     self.dumpJSON([])
        warnings.filterwarnings('ignore')
        self.generate_driver()
        if self.place_data() == True:
            # Click search button
            self.driver.find_element_by_id('ip-qs').click()
    
            time.sleep(5)

            if self.attr_type in attr_handler_map:
                self.dumpJSON(attr_handler_map[self.attr_type](self.driver))
            else:
                self.dumpJSON([])
        else:
            self.dumpJSON([])

def main(value, attr_type):
    tool = IPAPI(value, attr_type)
    tool.start()

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])

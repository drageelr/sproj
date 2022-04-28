from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import sys
import warnings
import json
import time

def handleEmailResults(driver):
    output_obj = []
        
    result_container_div = driver.find_element_by_id('pwnedSites')
    result_divs = result_container_div.find_elements_by_tag_name('div')

    for div in result_divs:
        pwned_site = div.get_attribute('id').strip().lower()
        output_obj.append(pwned_site)

    return output_obj

def handlePhoneResults(driver):
    pass

attr_handler_map = {
    'email': handleEmailResults,
    'phone': handleEmailResults
}

class HaveIBeenPwned:
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
        self.driver = webdriver.Chrome('/home/drageelr/Tools/chromedriver_linux64/chromedriver',options=options) # /home/drageelr/Tools/chromedriver_linux64/chromedriver '/root/chromedriver'
        self.driver.get('https://haveibeenpwned.com')

    def place_data(self):
        try:
            # WebDriverWait(self.driver, 10).until(lambda s: s.find_element_by_id('Account').is_displayed())
            # WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "Account")))
            # time.sleep(5)
            # self.driver.find_element_by_xpath('/html/body/div[0]/div[1]/div/form/div/input').send_keys(self.value)
            text_box = self.driver.find_element_by_id('Account')
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
            self.driver.find_element_by_id('searchPwnage').click()
    
            time.sleep(10)

            if self.attr_type in attr_handler_map:
                self.dumpJSON(attr_handler_map[self.attr_type](self.driver))
            else:
                self.dumpJSON([])
        else:
            self.dumpJSON([])

def main(value, attr_type):
    tool = HaveIBeenPwned(value, attr_type)
    tool.start()

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])

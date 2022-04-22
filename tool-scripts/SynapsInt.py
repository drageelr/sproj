from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import sys
import warnings
import json

def handleEmailResults(driver):
    output_obj = {}
        
    result_table = driver.find_element_by_id('tablaMail')
    result_rows = result_table.find_elements_by_tag_name('tr')

    for r in result_rows:
        r_data = r.find_elements_by_tag_name('td')
        output_obj[str(r_data[0].text).strip().lower()] = str(r_data[1].text).strip().lower()
        
    return output_obj

def handleIPResults(driver):
    pass

attr_handler_map = {
    'email': handleEmailResults,
    'ip': handleIPResults
}

class Synapsint:
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
        self.driver = webdriver.Chrome('/root/chromedriver',options=options)
        self.driver.get('https://synapsint.com/')

    def place_data(self):
        # Place value in text field
        self.driver.find_element_by_name('search').send_keys(self.value)

        # Mark appropriate type (key: 'btnradio')
        identifier_str = 'btnradio'
        type_labels = self.driver.find_elements_by_tag_name('label')
        tl_for_map = {}
        for tl in type_labels:
            tl_for = tl.get_attribute('for').strip().lower()
            tl_text = tl.text.strip().lower()
            if tl_for[:8] == identifier_str:
                tl_for_map[tl_text] = tl

        if self.attr_type in tl_for_map:
            tl_for_map[self.attr_type].click()
            return True

        return False

    def start(self):
        # try:
        #     pass
        # except:
        #     self.dumpJSON({})
        warnings.filterwarnings('ignore')
        self.generate_driver()
        if self.place_data() == True:
            # Click search button
            self.driver.find_element_by_xpath('/html/body/main/div/div/div/div/div/form/div[1]/button').click()
    
            if self.attr_type in attr_handler_map:
                self.dumpJSON(attr_handler_map[self.attr_type](self.driver))
            else:
                self.dumpJSON({})
        else:
            self.dumpJSON({})

def main(value, attr_type):
    tool = Synapsint(value, attr_type)
    tool.start()

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])    

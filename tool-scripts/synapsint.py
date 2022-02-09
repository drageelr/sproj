from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import os 
import warnings
import json
import sys


class SynapsInt:
    def __init__(self, parameter, searchVal):
        self._parameter = parameter
        self._searchVal = searchVal

    def search(self):
        osintResults = {}
        # path = os.getcwd() + "/chromedriver"
        options = Options()
        options.headless = True
        driver = webdriver.Chrome(options=options) 
        driver.get('https://synapsint.com/')

        # Search box
        search_box = driver.find_element_by_name("search")
        search_box.send_keys(self._searchVal)

        # Search button
        search_btn = driver.find_element_by_xpath("/html/body/main/div/div/div/div/div/form/div[1]/button")
        # search_btn.click()

        # Find all input radio boxes
        buttons = driver.find_elements_by_name("btnradio")

        button_map = {}
        for b in buttons:
            input_id = b.get_attribute("id").strip().lower()

            labels = driver.find_elements_by_tag_name("label")
            for label in labels:
                label_for = label.get_attribute("for").strip().lower()
                if label_for == input_id:
                    button_map[label.text.strip().lower()] = label

        # Check the required radio button
        button_map[self._parameter].click()
        
        # Get current url of page
        # print("URL: " , driver.current_url)
        # Click search button
        search_btn.click()

        # time.sleep(2)
        # print("URL: " , driver.current_url)

        # Find results table
        results = driver.find_element_by_id("tablaMail")
        
        rows = results.find_elements_by_tag_name("tr")
        
        for row in rows:
            data = row.find_elements_by_tag_name("td")
            osintResults[str(data[0].text).strip().lower()] = str(data[1].text).strip().lower()
        
        return osintResults

    
def main(email):
    warnings.filterwarnings("ignore")
    osint = SynapsInt("email",email)
    json_object = json.dumps(osint.search(), indent=2)
    print(json_object)
    # print(osint.search())




if __name__ == "__main__":
    main(sys.argv[1])
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
from bs4 import BeautifulSoup
import pandas as pd

from selenium.webdriver.support.ui import Select

url="https://results.bput.ac.in"
driver = webdriver.Chrome()
driver.get(url)
time.sleep(5)
select_field = Select(driver.find_element(By.CLASS_NAME, "select2-results__option"))
options = select_field.options
for option in options:
    print(option.get_attribute('innerHTML'))

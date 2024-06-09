from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
from bs4 import BeautifulSoup
import pandas as pd

from selenium.webdriver.support.ui import Select

def get_output(driver, url, field2_value, field3_value):
    driver.get(url)
    time.sleep(5)

    select_field = Select(driver.find_element(By.ID, "ddlSession"))
    field2 = driver.find_element(By.ID, "txtRegNo")
    field3 = driver.find_element(By.ID, "dpStudentdob_dateInput")
    submit_button = driver.find_element(By.ID, "btnView")

    select_field.select_by_visible_text("Even (2022-23)")
    field2.send_keys(field2_value)
    field3.send_keys(field3_value) 
    submit_button.click()

    time.sleep(5)

    link_buttons=driver.find_element(By.ID,"gvResultSummary_ctl03_lnkViewResult") #gvResultSummary_ctl03_lnkViewResult

    link_buttons.click()

    time.sleep(5)

    # result = driver.find_element(By.ID, 'gvResultSummary').text  # Adjust as per the HTML structure
    table_html = driver.find_element(By.ID, "gvViewResult").get_attribute('outerHTML')

    # Parse the HTML with BeautifulSoup
    soup = BeautifulSoup(table_html, "html.parser")

    # Read the table into a DataFrame
    df = pd.read_html(str(soup), header=0)[0]

    # Convert the DataFrame to JSON
    json_data = df.to_json(orient="records")
    return json_data

url = 'http://www.bputexam.in/StudentSection/ResultPublished/StudentResult.aspx'


driver = webdriver.Chrome()

try:
    # for input_data in inputs:
    #     result = get_output(driver, url, input_data['field1'], input_data['field2'])
    #     print(f"Input: {input_data} => Result: {result}")

    print(get_output(driver, url, '2101341019', '01-01-2000'))
finally:
    driver.quit()

    # return field1.get_attribute('innerHTML'), field2.get_attribute('innerHTML'), field3.get_attribute('innerHTML')